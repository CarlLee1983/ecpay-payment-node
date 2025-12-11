#!/bin/sh

# 讀取 commit message 檔案
commit_msg_file="$1"

# 檢查檔案是否存在
if [ ! -f "$commit_msg_file" ]; then
  echo "錯誤: Commit message 檔案不存在: $commit_msg_file" >&2
  exit 1
fi

# 讀取 commit message（只取第一行，忽略空行和註解）
# 先過濾掉註解行和空行，然後取第一行非空內容
first_line=$(sed -e '/^#/d' -e '/^$/d' "$commit_msg_file" 2>/dev/null | head -n 1 | sed 's/^[[:space:]]*//;s/[[:space:]]*$//')

# 如果過濾後為空，則讀取原始內容的第一行（去除前後空白）
if [ -z "$first_line" ]; then
  first_line=$(head -n 1 "$commit_msg_file" 2>/dev/null | sed 's/^[[:space:]]*//;s/[[:space:]]*$//')
fi

# 如果還是為空，嘗試讀取整個檔案的第一行（不進行任何過濾）
if [ -z "$first_line" ]; then
  first_line=$(cat "$commit_msg_file" 2>/dev/null | head -n 1 | sed 's/^[[:space:]]*//;s/[[:space:]]*$//')
fi

# 檢查是否為空字串或只有空白
if [ -z "$first_line" ] || [ -z "$(echo "$first_line" | tr -d '[:space:]')" ]; then
  echo ""
  echo "❌ Commit message 不能為空！"
  echo ""
  echo "請提供一個有效的 commit message。"
  echo ""
  echo "正確格式: <type>: [<scope>] <subject>"
  echo ""
  echo "type 必須是以下之一:"
  echo "  feat     - 新增/修改功能"
  echo "  fix      - Bug 修復"
  echo "  docs     - 文件改變"
  echo "  style    - 程式碼格式改變（不影響運行）"
  echo "  refactor - 功能重構"
  echo "  perf     - 性能優化"
  echo "  test     - 增加測試"
  echo "  chore    - 建構程序或輔助工具變動"
  echo "  revert   - 撤銷回覆先前的 commit"
  echo "  build    - 改變 build 工具"
  echo "  3rd      - 增加第三方"
  echo ""
  echo "範例:"
  echo "  chore: 優化構建配置"
  echo "  feat: 新增登入功能"
  echo "  fix: 修復付款金額驗證錯誤"
  echo ""
  exit 1
fi

# 檢查 commit message 格式
# 格式: <type>: [<scope>] <subject>
# 支援的格式：
#   - type: subject
#   - type(scope): subject
#   - type: [scope] subject
#   - type(scope): [scope] subject
# type: feat, fix, docs, style, refactor, perf, test, chore, revert, build, 3rd

# 更靈活的正則表達式，支援多種格式
pattern="^(feat|fix|docs|style|refactor|perf|test|chore|revert|build|3rd)(\([^)]+\))?:\s*(\[[^\]]+\])?\s*.+"

if ! echo "$first_line" | grep -qE "$pattern"; then
  echo ""
  echo "❌ Commit message 格式錯誤！"
  echo ""
  echo "您輸入的 commit message:"
  if [ -n "$first_line" ]; then
    echo "  \"$first_line\""
  else
    echo "  (空字串)"
  fi
  echo ""
  echo "正確格式: <type>: [<scope>] <subject>"
  echo ""
  echo "type 必須是以下之一:"
  echo "  feat     - 新增/修改功能"
  echo "  fix      - Bug 修復"
  echo "  docs     - 文件改變"
  echo "  style    - 程式碼格式改變（不影響運行）"
  echo "  refactor - 功能重構"
  echo "  perf     - 性能優化"
  echo "  test     - 增加測試"
  echo "  chore    - 建構程序或輔助工具變動"
  echo "  revert   - 撤銷回覆先前的 commit"
  echo "  build    - 改變 build 工具"
  echo "  3rd      - 增加第三方"
  echo ""
  echo "支援的格式範例:"
  echo "  feat: 新增登入功能"
  echo "  feat(web): 新增登入功能"
  echo "  feat: [web] 新增登入功能"
  echo "  fix: 修復付款金額驗證錯誤"
  echo "  chore: 優化構建配置"
  echo "  chore(build): 優化構建配置"
  echo ""
  exit 1
fi

# 驗證通過（不輸出訊息，避免干擾）

