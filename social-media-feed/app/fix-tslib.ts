// app/tslib-fix.ts
// @ts-ignore
import * as tslib from 'tslib';
const tslibExports = (tslib as any).default || tslib; // Fallback for ES modules
console.log(tslibExports); // Debug: Check available exports
// Manually create the destructure-able object
const tslibFixed = {
  __extends: tslibExports.__extends,
  __assign: tslibExports.__assign,
  __rest: tslibExports.__rest,
  __decorate: tslibExports.__decorate,
  __param: tslibExports.__param,
  __metadata: tslibExports.__metadata,
  __awaiter: tslibExports.__awaiter,
  __generator: tslibExports.__generator,
  __createBinding: tslibExports.__createBinding,
  __exportStar: tslibExports.__exportStar,
  __values: tslibExports.__values,
  __read: tslibExports.__read,
  __spread: tslibExports.__spread,
  __spreadArrays: tslibExports.__spreadArrays,
  __spreadArray: tslibExports.__spreadArray,
  __await: tslibExports.__await,
  __asyncGenerator: tslibExports.__asyncGenerator,
  __asyncDelegator: tslibExports.__asyncDelegator,
  __asyncValues: tslibExports.__asyncValues,
  __makeTemplateObject: tslibExports.__makeTemplateObject,
  __importStar: tslibExports.__importStar,
  __importDefault: tslibExports.__importDefault,
  __classPrivateFieldGet: tslibExports.__classPrivateFieldGet,
  __classPrivateFieldSet: tslibExports.__classPrivateFieldSet,
  __classPrivateFieldIn: tslibExports.__classPrivateFieldIn,
};