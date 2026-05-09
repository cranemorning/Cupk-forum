# 配置说明

## 环境变量配置

为了安全起见，敏感信息已从代码中移除，请通过环境变量或配置文件进行配置。

### 必需的环境变量

#### 数据库配置
```bash
DB_USERNAME=root
DB_PASSWORD=your-database-password
```

#### JWT配置
```bash
JWT_KEY=your-jwt-key
```

### 配置方式

#### 方式1：环境变量
在启动应用前设置环境变量：
```bash
export DB_PASSWORD=your-actual-password
export JWT_KEY=your-actual-jwt-key
```

#### 方式2：application.yml
直接在 `src/main/resources/application.yml` 中修改默认值：
```yaml
spring:
  datasource:
    username: ${DB_USERNAME:root}
    password: ${DB_PASSWORD:your-actual-password}

jwt:
  key: ${JWT_KEY:your-actual-jwt-key}
```

#### 方式3：IDE配置
在IDE的运行配置中添加环境变量。

### 安全建议

1. **不要**将真实的密钥提交到版本控制系统
2. **使用**强密码和复杂的JWT密钥
3. **定期**更换密钥和密码
4**使用**生产环境专用的配置文件
