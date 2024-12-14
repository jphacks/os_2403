import { Button } from "@/components/ui/button";
import styles from "./style.module.scss";

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
    <div className={styles.messageFormContainer}>
      <textarea
        className={styles.textArea}
        value={textAreaValue}
        onChange={e => setTextAreaValue(e.target.value)}
        placeholder="スカウトメッセージを入力してください..."
      />
      <div className={styles.buttonContainer}>
        <Button
          className={styles.submitButton}
          onClick={handleSubmit}
          disabled={isSending || !canSubmit}
        >
          招待を送る
        </Button>
      </div>
    </div>
  );
}
