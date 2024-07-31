import { UpdateFileCommand } from "./UpdateFile";
import { DriveFilesCommand } from "./DriveFiles";
import { ShowCommand } from "./Show";
import { UploadFileCommand } from "./UploadFile";
export interface Command {
  name: string;
  description: string;
  execute: (args: string[]) => Promise<void>;
}

export { PriceCommand } from "./Price";
export { ListCommand } from "./List";
export { CreateCommand } from "./Create";
export { ReadCommand } from "./Read";
export { UpdateCommand } from "./Update";
export { DeleteCommand } from "./Delete";
export { ShowCommand } from "./Show";
// google Drive
export { DriveFilesCommand } from "./DriveFiles";
export { UploadFileCommand } from "./UploadFile";
export { UpdateFileCommand } from "./UpdateFile";
