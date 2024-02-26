import Mock from "./mock.js";

import "./db/auth.js";
import "./db/ecommerce.js";
import "./db/notification.js";

Mock.onAny().passThrough();
