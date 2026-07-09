/*
  PAGE: AnalyticsPage

  Analizler ekranının sayfa seviyesindeki merkezidir.
  Veriyi useAnalyticsData hook'undan alır ve kart componentlerine dağıtır.

  Veri akışı:
  analyticsService -> useAnalyticsData -> AnalyticsPage -> kart componentleri
*/

import OverageCard from "../components/analytics/OverageCard.jsx";
import RevenueForecastCard from "../components/analytics/RevenueForecastCard.jsx";
import Button from "../components/ui/Button.jsx";
import StatusMessage from "../components/ui/StatusMessage.jsx";
import { useLanguage } from "../context/LanguageContext.jsx";
import useAnalyticsData from "../hooks/useAnalyticsData.js";
import { useEffect, useState } from "react";
import RecommendationSummaryCard from "../components/analytics/RecommendationSummaryCard.jsx";
import RecommendationListCard from "../components/analytics/RecommendationListCard.jsx";
import { getRecommendationSummary } from "../services/analyticsService.js";

export default function AnalyticsPage() {
  const { data, loading, error, reload } = useAnalyticsData();
  const [recommendationSummary, setRecommendationSummary] = useState([]);
  const [selectedAction, setSelectedAction] = useState(null);

  useEffect(() => {
    getRecommendationSummary().then(setRecommendationSummary);
  }, []);
  const { t, tv } = useLanguage();

  if (loading && !data) {
    return (
      <section className="page-content">
        <div className="page-heading">
          <h1>{t("analytics_title")}</h1>
          <p>{t("analytics_subtitle")}</p>
        </div>
        <StatusMessage>{t("analytics_loading")}</StatusMessage>
      </section>
    );
  }

  if (error && !data) {
    return (
      <section className="page-content">
        <div className="page-heading">
          <h1>{t("analytics_title")}</h1>
          <p>{t("analytics_error_title")}</p>
        </div>
        <StatusMessage tone="danger" action={<Button onClick={reload}>{t("button_retry")}</Button>}>
          {tv(error)}
        </StatusMessage>
      </section>
    );
  }

  return (
    <section className="page-content">
      <div className="page-heading">
        <h1>{t("analytics_title")}</h1>
        <p>{t("analytics_subtitle")}</p>
      </div>

      {error ? (
        <StatusMessage tone="danger" action={<Button onClick={reload}>{t("button_retry")}</Button>}>
          {tv(error)}
        </StatusMessage>
      ) : null}

      <div className="analytics-stack">
        <RevenueForecastCard forecast={data?.revenueForecast} />
        <OverageCard overage={data?.overage} />

        <RecommendationSummaryCard
          summary={recommendationSummary}
          selectedAction={selectedAction}
          onSelect={setSelectedAction}
        />
        {selectedAction ? (
          <RecommendationListCard
            action={selectedAction}
            actionLabel={
              recommendationSummary.find((s) => s.action === selectedAction)?.label ?? selectedAction
            }
          />
        ) : null}
      </div>
    </section>
  );
}
