
---
name: Env
route: /env
---

import env, { isApp, getDevPhrase, getWebHost, getApiHost, getMobileHost, getTidaEnv } from './env';

# Env

> 环境判断

```
console.log(env());
console.log(isApp());          // => true
console.log(getDevPhrase());   // => 'production'
console.log(getWebHost());     // => 'https://www.helijia.com'
console.log(getApiHost());     // => 'https://app.helija.com'
console.log(getMobileHost());  // => 'https://m.helijia.com'
```
