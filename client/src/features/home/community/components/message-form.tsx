// components/MessageForm.tsx

import { Button } from "@/components/ui/button";

type MessageFormProps = {
  textAreaValue: string;
  setTextAreaValue: (value: string) => void;
  handleSubmit: () => void;
  isSending: boolean;
  canSubmit: boolean;
};

export function MessageForm({
  textAreaValue,
  setTextAreaValue,
  handleSubmit,
  isSending,
  canSubmit,
}: MessageFormProps) {
  return (
    <div>
      <textarea
        className="w-full h-60 p-2 border rounded-md"
        value={textAreaValue}
        onChange={e => setTextAreaValue(e.target.value)}
        placeholder="スカウトメッセージを入力してください..."
      />
      <div className="flex justify-end mt-2">
        <Button onClick={handleSubmit} disabled={isSending || !canSubmit}>
          招待を送る
        </Button>
      </div>
    </div>
  );
}