export enum ChangeType {
  Added = 'A',
  Copied = 'C',
  Deleted = 'D',
  Modified = 'M',
  Renamed = 'R',
  TypeChanged = 'T',
  Unmerged = 'U',
  Unknown = 'X'
}

export type ChangedFiles = {
  [key in ChangeType]: string[]
}
