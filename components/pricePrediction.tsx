"use client";

import { useState, useEffect, useMemo } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info, IndianRupee, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, ExternalLink, CalendarDays, MapPin, Sprout } from "lucide-react";

type ApiResult = {
  success?: boolean;
  error?: string;
  date?: string;
  predicted?: number;
  lower_bound?: number;
  upper_bound?: number;
  plotUrl?: string | null;
};

export default function ForecastPage() {
  const [crop, setCrop] = useState("");
  const [district, setDistrict] = useState("");
  const [forecastType, setForecastType] = useState<"daily" | "weekly">("daily");
  const [selectedDate, setSelectedDate] = useState("");
  const [result, setResult] = useState<ApiResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [crops, setCrops] = useState<string[]>([]);
  const [districts, setDistricts] = useState<string[]>([]);

  // Load crop & district options from JSON (public/data/crop_districts.json)
  useEffect(() => {
    fetch("/data/crop_districts.json")
      .then((res) => res.json())
      .then((data) => {
        setCrops(data.crops || []);
        setDistricts(data.districts || []);
      })
      .catch((err) => console.error("Error loading crop/district data", err));
  }, []);

  const canSubmit = crop && district && !loading;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setLoading(true);
    setResult(null);
    try {
      const response = await fetch("/api/price-predictions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          crop,
          state: "Maharashtra",
          district,
          type: forecastType,
          date: selectedDate || null,
        }),
      });

      const data: ApiResult = await response.json();
      if (data.success) {
        setResult(data);
      } else {
        setResult({ error: data.error || "Something went wrong" });
      }
    } catch (err) {
      console.error(err);
      setResult({ error: "Something went wrong" });
    } finally {
      setLoading(false);
    }
  };

  // Helpers
  const formatInr = (n?: number) =>
    typeof n === "number"
      ? n.toLocaleString("en-IN", { maximumFractionDigits: 2 })
      : "—";

  const bandWidth = useMemo(() => {
    if (!result?.lower_bound || !result?.upper_bound) return null;
    const spread = result.upper_bound - result.lower_bound;
    return spread >= 0 ? spread : null;
  }, [result]);

  const skew = useMemo<"up" | "down" | "mid" | null>(() => {
    if (
      typeof result?.predicted !== "number" ||
      typeof result?.lower_bound !== "number" ||
      typeof result?.upper_bound !== "number"
    )
      return null;
    const { predicted, lower_bound, upper_bound } = result;
    const range = upper_bound - lower_bound || 1;
    const pos = (predicted - lower_bound) / range; // 0..1
    if (pos > 0.66) return "up";
    if (pos < 0.33) return "down";
    return "mid";
  }, [result]);

  return (
    <TooltipProvider>
      <div className="mx-auto max-w-6xl p-4 md:p-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* LEFT: Inputs */}
          <Card className="md:sticky md:top-6 h-fit">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sprout className="h-5 w-5" />
                Crop Price Forecast
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              {/* Crop */}
              <div className="space-y-2">
                <Label>Crop</Label>
                <Select onValueChange={setCrop}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select crop" />
                  </SelectTrigger>
                  <SelectContent className="max-h-64">
                    {crops.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* District */}
              <div className="space-y-2">
                <Label>District</Label>
                <Select onValueChange={setDistrict}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select district" />
                  </SelectTrigger>
                  <SelectContent className="max-h-64">
                    {districts.map((d) => (
                      <SelectItem key={d} value={d}>
                        {d}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Date */}
              <div className="space-y-2">
                <Label>Select Date (optional)</Label>
                <div className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 opacity-60" />
                  <Input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                  />
                </div>
              </div>

              {/* Forecast Type */}
              <div className="space-y-2">
                <Label>Forecast Type</Label>
                <Select onValueChange={(v) => setForecastType(v as "daily" | "weekly")} defaultValue="daily">
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select forecast type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily Forecast</SelectItem>
                    <SelectItem value="weekly">Weekly Forecast</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={handleSubmit} disabled={!canSubmit} className="w-full">
                {loading ? "Loading..." : "Get Forecast"}
              </Button>

              {/* Selections summary */}
              <div className="flex flex-wrap gap-2 pt-2">
                {crop && <Badge variant="secondary" className="gap-1"><Sprout className="h-3 w-3" /> {crop}</Badge>}
                {district && <Badge variant="secondary" className="gap-1"><MapPin className="h-3 w-3" /> {district}</Badge>}
                <Badge variant="outline">{forecastType.toUpperCase()}</Badge>
                {selectedDate && <Badge variant="outline">{selectedDate}</Badge>}
              </div>

              {!crop || !district ? (
                <p className="text-xs text-muted-foreground">
                  Select a crop and district to enable the forecast.
                </p>
              ) : null}
            </CardContent>
          </Card>

          {/* RIGHT: Results */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Predicted Price</CardTitle>
              </CardHeader>
              <CardContent>
                {!result && !loading && (
                  <p className="text-sm text-muted-foreground">
                    Run a forecast to see predicted price, confidence band, and trend hints here.
                  </p>
                )}

                {loading && (
                  <div className="space-y-4">
                    <div className="h-8 w-48 animate-pulse rounded-lg bg-muted" />
                    <div className="grid grid-cols-2 gap-4">
                      <div className="h-14 animate-pulse rounded-lg bg-muted" />
                      <div className="h-14 animate-pulse rounded-lg bg-muted" />
                    </div>
                    <div className="h-10 w-56 animate-pulse rounded-lg bg-muted" />
                  </div>
                )}

                {result && (
                  <>
                    {result.error ? (
                      <p className="text-red-500">{result.error}</p>
                    ) : (
                      <div className="space-y-5">
                        {/* Main value */}
                        <div className="flex items-end gap-3">
                          <div className="flex items-center gap-2 text-3xl font-semibold tracking-tight">
                            <IndianRupee className="h-7 w-7 opacity-70" />
                            {formatInr(result.predicted)}
                          </div>

                          {/* Trend hint */}
                          {skew === "up" ? (
                            <Badge className="gap-1 bg-emerald-600 hover:bg-emerald-600">
                              <TrendingUp className="h-3.5 w-3.5" />
                              upward bias
                            </Badge>
                          ) : skew === "down" ? (
                            <Badge className="gap-1 bg-rose-600 hover:bg-rose-600">
                              <TrendingDown className="h-3.5 w-3.5" />
                              downward bias
                            </Badge>
                          ) : (
                            <Badge variant="secondary">neutral</Badge>
                          )}
                        </div>

                        {/* Meta */}
                        <div className="text-sm text-muted-foreground">
                          for <span className="font-medium">{crop}</span> in{" "}
                          <span className="font-medium">{district}, Maharashtra</span>{" "}
                          on <span className="font-medium">{result.date}</span>
                        </div>

                        {/* Bounds with tooltips */}
                        <div className="grid grid-cols-2 gap-4">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="flex items-center justify-between rounded-xl border p-3">
                                <div className="flex items-center gap-2">
                                  <ArrowDownRight className="h-4 w-4 text-rose-600" />
                                  <span className="text-sm text-muted-foreground">Lower bound</span>
                                </div>
                                <div className="font-medium">{formatInr(result.lower_bound)}</div>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>
                                The model expects prices to stay above this level in most scenarios.
                              </p>
                            </TooltipContent>
                          </Tooltip>

                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="flex items-center justify-between rounded-xl border p-3">
                                <div className="flex items-center gap-2">
                                  <ArrowUpRight className="h-4 w-4 text-emerald-600" />
                                  <span className="text-sm text-muted-foreground">Upper bound</span>
                                </div>
                                <div className="font-medium">{formatInr(result.upper_bound)}</div>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>
                                The model expects prices to remain below this level in most scenarios.
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </div>

                        {/* Confidence/band */}
                        {typeof bandWidth === "number" && (
  <div className="rounded-xl border p-4 shadow-sm bg-card space-y-2">
    {/* Header */}
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2 text-sm font-medium text-foreground">
        <Info className="h-4 w-4 text-muted-foreground" />
        <span>Confidence Band Width</span>
      </div>
      <div className="text-sm font-semibold text-primary">
        ₹ {formatInr(bandWidth)}
      </div>
    </div>

    {/* Short meaning */}
    <p className="text-xs text-muted-foreground leading-relaxed">
      Narrower bands imply more certainty, while wider bands indicate higher volatility.
    </p>

    {/* Detailed explanation */}
    <div className="rounded-lg bg-muted p-2 text-xs text-muted-foreground">
      <p>
        The confidence band width represents the average range between the
        <span className="font-medium"> upper </span> and 
        <span className="font-medium"> lower forecast limits</span>.
        A smaller width means the model is more confident in its prediction, 
        while a larger width suggests possible price swings or uncertainty.
      </p>
    </div>
  </div>
)}


                        {/* Plot action */}
                        {result.plotUrl && (
                          <div className="pt-1">
                            <a
                              href={result.plotUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
                            >
                              <ExternalLink className="h-4 w-4" />
                              Open Interactive Plot
                            </a>
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}