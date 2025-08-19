"use client";

import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Camera, Upload, Shield, AlertTriangle, CheckCircle } from "lucide-react";

export default function DiseaseDetection() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Handle file upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setFile(file);
      setUploadedImage(URL.createObjectURL(file));
    }
  };

  // Handle Take Photo using camera
  const handleTakePhoto = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });

      const video = document.createElement("video");
      video.srcObject = stream;
      video.play();

      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");

      video.onloadedmetadata = () => {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        setTimeout(() => {
          if (context) {
            context.drawImage(video, 0, 0);
            const imageDataUrl = canvas.toDataURL("image/jpeg");

            // Convert DataURL to File object for formData
            const arr = imageDataUrl.split(",");
            const mime = arr[0].match(/:(.*?);/)![1];
            const bstr = atob(arr[1]);
            let n = bstr.length;
            const u8arr = new Uint8Array(n);
            while (n--) u8arr[n] = bstr.charCodeAt(n);
            const photoFile = new File([u8arr], "photo.jpg", { type: mime });

            setUploadedImage(imageDataUrl);
            setFile(photoFile);
          }

          // Stop camera stream
          stream.getTracks().forEach((track) => track.stop());
        }, 2000); // capture after 2 seconds
      };
    } catch (err) {
      console.error("Camera error:", err);
      // fallback to file input
      document.getElementById("image-upload")?.click();
    }
  };

  // Handle analyze
  const handleAnalyze = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/disease-detection", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        setResult(data.prediction);
      } else {
        setError(data.error || "Prediction failed.");
      }
    } catch (err) {
      setError("Server error: " + err);
    }

    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Upload / Take Photo Card */}
        <Card>
          <CardHeader>
            <CardTitle>Upload Crop Image</CardTitle>
            <CardDescription>
              Take or upload a photo of your crop for AI analysis
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-2 border-dashed border-accent/20 rounded-lg p-8 text-center">
              {uploadedImage ? (
                <div className="space-y-4">
                  <img
                    src={uploadedImage}
                    alt="Uploaded crop"
                    className="max-h-48 mx-auto rounded-lg"
                  />
                  <Button
                    variant="outline"
                    onClick={() => {
                      setUploadedImage(null);
                      setFile(null);
                      setResult(null);
                    }}
                  >
                    Upload Different Image
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <Camera className="h-12 w-12 text-accent mx-auto" />
                  <div>
                    <p className="text-sm font-medium">Upload crop image</p>
                    <p className="text-xs text-muted-foreground">
                      Supports JPG, PNG up to 10MB
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 justify-center">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleTakePhoto}
                      className="hover:bg-black hover:text-white hover:border-black transition-all duration-300 bg-transparent"
                    >
                      <Camera className="mr-2 h-4 w-4" />
                      Take Photo
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className="hover:bg-black hover:text-white hover:border-black transition-all duration-300 bg-transparent"
                    >
                      <label htmlFor="image-upload" className="cursor-pointer">
                        <Upload className="mr-2 h-4 w-4" />
                        Upload Image
                      </label>
                    </Button>
                  </div>
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>
              )}
            </div>

            {uploadedImage && (
              <Button className="w-full" onClick={handleAnalyze} disabled={loading}>
                <Shield className="mr-2 h-4 w-4" />
                {loading ? "Analyzing..." : "Analyze for Diseases"}
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Disease Result Card */}
        <Card>
          <CardHeader>
            <CardTitle>Disease Analysis Results</CardTitle>
            <CardDescription>AI-powered crop health assessment</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!result && !error && (
              <p className="text-sm text-muted-foreground">
                Upload an image and click analyze to see results.
              </p>
            )}

            {error && <p className="text-red-500 text-sm">⚠ {error}</p>}

            {result && (
              <>
                <div className="flex items-center justify-between p-3 bg-destructive/10 rounded-lg border border-destructive/20">
                  <div className="flex items-center space-x-3">
                    <AlertTriangle className="h-5 w-5 text-destructive" />
                    <div>
                      <h4 className="font-medium">{result.class}</h4>
                      <p className="text-sm text-muted-foreground">
                        Confidence: {result.confidence}%
                      </p>
                    </div>
                  </div>
                  <Badge variant="destructive">
                    {result.confidence > 80 ? "High Risk" : "Possible"}
                  </Badge>
                </div>

                <div className="space-y-3 pt-4 border-t">
                  <h4 className="font-medium">Treatment Recommendations:</h4>
                  <div className="space-y-2 text-sm">
                    {result.treatments["Organic Control"].map((t: string, idx: number) => (
                      <div key={idx} className="flex items-start space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                        <p>{t}</p>
                      </div>
                    ))}
                    {result.treatments["Chemical Control"].map((t: string, idx: number) => (
                      <div key={idx} className="flex items-start space-x-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                        <p>{t}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
