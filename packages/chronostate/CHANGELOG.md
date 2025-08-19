```
2.3.0
- Addressed the lack of network error handling to fix API rotation issues
- Implemented a fix for repeatedly processed blocks, which prevented incorrect state updates
- Patched the leaked database connections to prevent resource exhaustion
- Resolved incompatible Action interfaces that caused integration failures
- Corrected the inconsistent inclusion and exclusion of empty arguments in extractMemoContent to avoid confusion
- Fixed the prototype pollution vulnerability, which previously allowed crafted memos to bypass validation
- Repaired the infinite retry loop caused by failed batch fetching
- Fixed a malicious transaction memo issue that was causing the indexer to halt
- Added a check on action ordering to prevent state corruption
- Updated the cloning method to be more robust, preventing data corruption
- Corrected incorrect test expected values to ensure validation against the right parameters
- Fixed the incorrect usage of expect in vitest, ensuring tests now fail properly
- Handled the unhandled exception in the base64ToArrayBuffer function to prevent application crashes
- Implemented a check on the returned value of findIndex to prevent incorrect callback removal
- Clarified the message filter logic to prevent unexpected transaction inclusion
- Handled JSON stringify operations to prevent process crashes
- Added verification on the namespace to prevent state corruption
- Removed hardcoded API endpoint assumptions
- Improved generic error messages to better indicate the root cause
- Updated the function description to address inconsistencies and avoid confusion
- Standardized inconsistent parameter types across API functions
- Corrected inaccurate documentation that could mislead developers
- Adjusted the incremental ID to start at one, for standard indexing
- Expanded support for nested authz MsgExec transactions
- Removed the unused lastAction variable to reduce confusion for application developers
- Updated outdated dependency versions to resolve security vulnerabilities 

2.2.1
- Fix primitive for string, reduce complexity

2.2.0
- Return only hash, memo, timestamp, height, and messages for onAction

2.1.0
- Return all messages when a matching memo is found

2.0.6
- Update Tests and Decouple Memo Fetch Logic

2.0.5
- License update

2.0.4
- Fix Type Exports

2.0.3
- Add function extractMemoContent

2.0.2
- Fix last block event type

2.0.1
- Add support for multi-prefix with comma delimiter

2.0.0
- Rename

1.2.2
- Adjusted types for partial data support

1.2.1
- Added additional test cases, and better throw error for block heights

1.2.0
- Added ability to specify end block in `start` function, allowing for a specific time frame of blocks to be parsed

1.1.2
- Fix issue where unicode memos were being compared instead of plain text

1.1.1
- Decode unicode in memos to plain text

1.1.0
- Added onLastBlock, and offLastBlock

1.0.3
- Add Type Distribution

1.0.2
- Update Readme

1.0.1
- Update Readme

1.0.0
- Initial Release
```