import { useTranslation } from "react-i18next";
import Subheader from "../Subheader";

export default function MusicList() {
  const { t } = useTranslation("music:list");
  return (
    <div className="body">
      <Subheader title={t("title")} />
    </div>
  );
}
