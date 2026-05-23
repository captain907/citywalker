# 后端接口与界面落地规划

## 1. 目标

本项目当前前端页面已经具备完整的产品流程，但数据仍然主要来自本地 mock。后端第一阶段的目标不是一次性做完所有复杂能力，而是先把“页面可接入的接口骨架”和“从按钮到接口的行为链路”定下来，保证后续开发可以按模块推进。

第一阶段重点链路：

1. 浏览委托模板
2. 选择偏好并生成路线
3. 查看路线详情
4. 完成任务并结算奖励
5. 查看个人档案、收藏和地图进度

## 2. 现有页面与业务映射

### 2.1 首页 `/`

文件：
- [client/screens/home/index.tsx](/F:/codex_program/life/project_20260523_160514/projects/client/screens/home/index.tsx:1)

页面职责：
- 展示用户当前等级、XP、四维属性
- 展示推荐中的今日委托摘要
- 提供进入委托列表的主入口

页面区块与接口：

1. 顶部旅者档案区
   - 显示昵称、等级、XP、升级提示
   - 数据来源：`GET /api/v1/profile`

2. 今日状态区
   - 显示 vitality、exploration、joy、taste
   - 数据来源：`GET /api/v1/profile`

3. 今日委托摘要卡
   - 显示推荐路线标题、说明、奖励标签
   - 数据来源：`GET /api/v1/quests/current`
   - 无当前任务时显示“暂无进行中的委托”

4. 主按钮“翻开委托簿”
   - 行为：跳转 `/quests`
   - 不直接调用接口

需要补充的界面状态：
- `loading`：骨架屏，覆盖档案区和委托卡
- `error`：顶部 toast “首页数据加载失败”
- `empty`：无当前任务时显示空态卡片

### 2.2 委托列表页 `/quests`

文件：
- [client/screens/quests/index.tsx](/F:/codex_program/life/project_20260523_160514/projects/client/screens/quests/index.tsx:1)

页面职责：
- 展示所有委托模板
- 让用户选择一个委托方向

页面区块与接口：

1. 委托卡列表
   - 数据来源：`GET /api/v1/quests/templates`
   - 返回 `questTemplates[]`

2. 每张委托卡主点击区
   - 行为：记录当前选中的模板，然后跳转 `/quest-generate`
   - 建议前端本地先保存 `selectedTemplateId`
   - 后端暂不需要调用

需要补充的界面状态：
- `loading`：卡片 skeleton 列表
- `error`：页内重试按钮
- `empty`：显示“暂无可领取委托”

### 2.3 路线生成页 `/quest-generate`

文件：
- [client/screens/quest-generate/index.tsx](/F:/codex_program/life/project_20260523_160514/projects/client/screens/quest-generate/index.tsx:1)

页面职责：
- 收集用户偏好
- 触发路线生成

页面可交互元素与接口：

1. 返回按钮
   - 行为：返回 `/quests`

2. 出发地标签组
   - 状态：单选
   - 字段：`departure`

3. 主题标签组
   - 状态：单选
   - 字段：`mood`

4. 预算标签组
   - 状态：单选
   - 字段：`budget`

5. 时长标签组
   - 状态：单选
   - 字段：`time`

6. 偏好标签组
   - 状态：多选
   - 字段：`foodPreference`

7. 主按钮“生成路线”
   - 行为：`POST /api/v1/quests/generate`
   - 请求体：
     - `templateId`
     - `departure`
     - `budget`
     - `time`
     - `mood`
     - `foodPreference[]`
     - `vibe`
   - 成功后：
     - 更新当前任务
     - 跳转 `/route-detail`

8. 按钮禁用规则
   - 未选模板时禁用
   - 请求进行中禁用

需要补充的界面状态：
- `submitting`：按钮显示“生成中...”
- `error`：页内 toast “路线生成失败，请稍后再试”
- `quota_exceeded`：显示“今日生成次数已用尽”

### 2.4 路线详情页 `/route-detail`

文件：
- [client/screens/route-detail/index.tsx](/F:/codex_program/life/project_20260523_160514/projects/client/screens/route-detail/index.tsx:1)

页面职责：
- 展示生成后的路线详情
- 给用户一个明确的“开始出发”动作

页面区块与接口：

1. 页面初始化加载
   - 数据来源：`GET /api/v1/quests/current`
   - 若当前任务里含 `routeId`，再调用 `GET /api/v1/routes/:routeId`

2. 返回按钮
   - 行为：返回上一页

3. 路线标题区
   - 显示路线名、副标题
   - 数据来源：当前任务 + 路线详情

4. 路程信息区
   - 显示距离、时长、打卡点数量
   - 数据来源：`GET /api/v1/routes/:routeId`

5. 节点任务列表
   - 每个节点包含标题、描述、奖励
   - 数据来源：`GET /api/v1/routes/:routeId`

6. 氛围与附注区
   - 数据来源：当前任务 + 路线详情

7. 主按钮“开始出发”
   - 当前阶段只做页面流转：跳转 `/quest-complete`
   - 第二阶段可接 `POST /api/v1/quests/:questId/start`

需要补充的界面状态：
- `loading`：路线 skeleton
- `error`：页内重试按钮
- `empty`：无路线时显示“还没有可展开的路线卷轴”

### 2.5 完成任务页 `/quest-complete`

文件：
- [client/screens/quest-complete/index.tsx](/F:/codex_program/life/project_20260523_160514/projects/client/screens/quest-complete/index.tsx:1)

页面职责：
- 收集满意度
- 完成任务结算
- 展示奖励结果

页面可交互元素与接口：

1. 星级评分 1-5
   - 本地状态 `satisfaction`

2. 主按钮“确认完成”
   - 行为：`POST /api/v1/quests/:questId/complete`
   - 请求体：
     - `satisfaction`
   - 成功响应：
     - 本次任务奖励
     - 新增 XP
     - 四维属性变化
     - 新增收藏
     - 新等级

3. 结果态按钮“继续探索”
   - 行为：跳转首页

4. 结果态按钮“查看成长档案”
   - 行为：跳转 `/profile`

需要补充的界面状态：
- 未选择评分时，完成按钮禁用
- 提交中时显示加载态
- 提交成功后切换为结果页
- 提交失败时显示 toast，并保留评分

### 2.6 地图页 `/map`

文件：
- [client/screens/map/index.tsx](/F:/codex_program/life/project_20260523_160514/projects/client/screens/map/index.tsx:1)

页面职责：
- 展示城市区域探索进度

页面区块与接口：

1. 区域解锁总进度
   - 数据来源：`GET /api/v1/map/progress`

2. 区域列表
   - 字段：
     - `districtName`
     - `status`
     - `xp`
     - `isUnlocked`
   - 数据来源：`GET /api/v1/map/progress`

可补充的交互：
- 点击区域卡进入区域详情页
- 当前阶段可先不做跳转

### 2.7 图鉴页 `/archive`

文件：
- [client/screens/archive/index.tsx](/F:/codex_program/life/project_20260523_160514/projects/client/screens/archive/index.tsx:1)

页面职责：
- 展示四类收藏汇总

页面区块与接口：

1. 收藏总览
   - 数据来源：`GET /api/v1/archive/overview`

2. 四大类卡片
   - `cityMemory`
   - `cuisineArchive`
   - `landmarkDiscovery`
   - `vibeCollection`
   - 数据来源：`GET /api/v1/archive/overview`

可补充的交互：
- 点击收藏卡片进入详情页
- 第一阶段先展示数量和样例即可

### 2.8 我的页 `/profile`

文件：
- [client/screens/profile/index.tsx](/F:/codex_program/life/project_20260523_160514/projects/client/screens/profile/index.tsx:1)

页面职责：
- 展示用户档案、成长信息和路线历史

页面区块与接口：

1. 用户基础档案
   - 数据来源：`GET /api/v1/profile`

2. XP 进度
   - 数据来源：`GET /api/v1/profile`

3. 成就统计
   - 数据来源：`GET /api/v1/profile`

4. 收藏卡片摘要
   - 数据来源：`GET /api/v1/archive/overview`

5. 可新增“最近路线”列表
   - 数据来源：`GET /api/v1/profile/history`

## 3. 推荐接口清单

### 3.1 健康检查

- `GET /api/v1/health`

返回：

```json
{
  "status": "ok"
}
```

### 3.2 认证

- `GET /api/v1/auth/me`

说明：
- 当前前端 `AuthContext` 还未接入
- 第一阶段仅返回一个模拟用户即可

### 3.3 委托模板

- `GET /api/v1/quests/templates`

返回字段建议：

```json
{
  "templates": [
    {
      "id": "after-meal-1km",
      "title": "饭后一公里",
      "description": "轻量散步型路线模板",
      "type": "饭后路线",
      "questType": "桥边散步",
      "xp": 20,
      "icon": "person-walking",
      "recommended": "适合想消食和看风景的用户",
      "difficulty": "easy",
      "possibleDiscoveries": ["桥边灯火", "街角糖水"]
    }
  ]
}
```

### 3.4 生成委托

- `POST /api/v1/quests/generate`

请求体：

```json
{
  "templateId": "crayfish-explore",
  "departure": "太平老街",
  "budget": "60 - 100",
  "time": "一日",
  "mood": "美食寻味",
  "foodPreference": ["小吃探索", "拍照打卡"],
  "vibe": "美食寻味"
}
```

返回：

```json
{
  "quest": {
    "id": "quest-current",
    "routeId": "route-pearl-night-001",
    "quest_type": "风味夜游",
    "route_title": "太平老街 · 江风寻味之旅",
    "budget": "60 - 100",
    "duration": "3.5 小时",
    "intensity": "轻松",
    "people": "2 - 4 人",
    "vibe_tags": ["夜晚江风", "热闹食摊", "老城灯火"],
    "timeline": [
      "18:30 出发",
      "19:00 第一站",
      "21:30 收尾"
    ],
    "expected_rewards": {
      "vitality": 12,
      "exploration": 18,
      "joy": 15,
      "taste": 16,
      "xp": 42
    }
  }
}
```

### 3.5 当前任务

- `GET /api/v1/quests/current`

返回：
- 当前任务存在时：返回 `quest`
- 不存在时：返回 `quest: null`

### 3.6 路线详情

- `GET /api/v1/routes/:routeId`

返回字段建议：

```json
{
  "route": {
    "id": "route-pearl-night-001",
    "title": "太平老街 · 江风寻味之旅",
    "distanceKm": 4.2,
    "duration": "3.5 小时",
    "checkinCount": 5,
    "stops": [
      {
        "id": 1,
        "title": "老街牌坊",
        "description": "在入口完成开场打卡",
        "xp": 30
      }
    ],
    "note": "适合夜间轻量探索"
  }
}
```

### 3.7 完成任务

- `POST /api/v1/quests/:questId/complete`

请求体：

```json
{
  "satisfaction": 5
}
```

返回：

```json
{
  "completion": {
    "questId": "quest-current",
    "gainedXp": 52,
    "levelBefore": 2,
    "levelAfter": 3,
    "coreAttributes": {
      "before": {
        "vitality": 62,
        "exploration": 38,
        "joy": 54,
        "taste": 41
      },
      "after": {
        "vitality": 74,
        "exploration": 56,
        "joy": 69,
        "taste": 57
      }
    },
    "unlockedCollections": {
      "cityMemory": ["珠江桥边"],
      "cuisineArchive": ["口味虾"],
      "landmarkDiscovery": ["江边散步点"],
      "vibeCollection": ["夜晚江风"]
    }
  }
}
```

### 3.8 档案与历史

- `GET /api/v1/profile`
- `GET /api/v1/profile/history`

### 3.9 收藏总览

- `GET /api/v1/archive/overview`

### 3.10 地图进度

- `GET /api/v1/map/progress`

## 4. 后端模块划分建议

### 4.1 第一阶段目录

建议在 `server/src` 下拆成：

- `index.ts`
- `routes/`
- `schemas/`
- `services/`
- `data/`
- `types/`

### 4.2 模块职责

- `routes`
  - 只处理路由、请求解析、响应输出

- `schemas`
  - 用 `zod` 做请求体和 params 校验

- `services`
  - 处理业务逻辑，比如生成任务、结算奖励、计算等级

- `data`
  - 第一阶段先放 mock 数据
  - 第二阶段替换成 Drizzle + PostgreSQL

## 5. 详细任务拆分

### 任务组 A：后端骨架

1. 建立统一响应结构
2. 增加错误处理中间件
3. 增加 `zod` 校验
4. 建立 mock 数据层
5. 建立路由模块

验收标准：
- 所有 `/api/v1/*` 路由都有明确返回结构
- 非法请求返回 4xx
- 未知错误返回 500

### 任务组 B：委托与路线链路

1. 完成模板列表接口
2. 完成路线生成接口
3. 完成当前任务接口
4. 完成路线详情接口
5. 完成任务完成接口

验收标准：
- 用户可从“委托列表”一路走到“任务完成”
- 所有页面都不再依赖本地 `mockCurrentQuest()`

### 任务组 C：档案与地图链路

1. 完成 `profile` 接口
2. 完成 `profile/history` 接口
3. 完成 `archive/overview` 接口
4. 完成 `map/progress` 接口

验收标准：
- 首页、图鉴页、地图页、我的页都有真实 API 数据来源

### 任务组 D：前端接入

1. 新建 `client/src/api` 或 `client/utils/api.ts`
2. 接入统一请求层
3. 把 `AppContext` 从本地 mock 切到接口请求
4. 增加 loading/error/empty 状态
5. 增加完成任务后的数据刷新

验收标准：
- 页面刷新后数据仍一致
- 任务完成后首页、图鉴、地图、我的页同步变化

### 任务组 E：持久化

1. 设计数据库表
2. 用 Drizzle 建 schema
3. 替换内存 mock 数据
4. 增加用户隔离

建议表：
- `users`
- `quest_templates`
- `quests`
- `routes`
- `route_stops`
- `route_history`
- `user_profile`
- `user_collections`
- `district_progress`

## 6. 当前开发顺序建议

最推荐的顺序：

1. 先把后端接口骨架搭出来
2. 再让前端页面逐页接接口
3. 接完后再替换成数据库

原因：
- 可以先把前后端契约稳定下来
- 页面可以边接边验证，不必等数据库全做完
- 后期换持久化实现时，前端几乎不需要改

## 7. 本次落地范围

本次建议先完成：

1. Git 基线快照
2. 后端接口骨架
3. 文档化接口契约

下一次建议继续：

1. 前端请求层
2. `AppContext` 去 mock
3. 页面 loading/error/empty 状态
