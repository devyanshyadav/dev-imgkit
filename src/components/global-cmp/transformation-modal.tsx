import React, { useEffect, useState } from "react";
import { MdTransform } from "react-icons/md";
import DevButton from "../../components/dev-components/dev-button";
import DevInput from "../../components/dev-components/dev-input";
import DevSelect from "../../components/dev-components/dev-select";
import DevRangeSlider from "../../components/dev-components/dev-range-slider";
import DevCheckbox from "../../components/dev-components/dev-checkbox";
import DevClipboard from "../../components/dev-components/dev-clipboard";
import { IoCopy, IoCopyOutline } from "react-icons/io5";
import { TxtLLM } from "../../utils/text-llm";
import { LLMPrompt } from "../../utils/llm-prompt";
import { useStore } from "../../utils/zustsore";
import { FaArrowDown } from "react-icons/fa";
import DevLaserInput from "../dev-components/dev-laserinput";
import { toast } from "sonner";
import { LuLoaderCircle } from "react-icons/lu";

type ResizeMode = "scale" | "fill" | "fit" | "crop";
type FlipDirection = "h" | "v" | "none";
type CompressionLevel = "high" | "medium" | "low";
type Effect = "grayscale" | "negative" | "sepia";
interface ResizeParams {
  width: number;
  height: number;
}

interface Params {
  [key: string]: any;
  resize: ResizeParams;
  mode: ResizeMode;
  format: string;
  quality: number;
  compression: CompressionLevel;
  effects: Effect[];
  blur: number;
  brightness: number;
  contrast: number;
  saturation: number;
  hue: number;
  radius: number;
  rotate: number;
  flip: FlipDirection;
  border: number;
  borderColor: string;
  background: string;
  opacity: number;
  noise: number;
  median: number;
  threshold: number;
}

// Define default values
const defaultParams: Params = {
  resize: {
    width: 800,
    height: 600,
  },
  mode: "fit",
  format: "jpeg",
  quality: 80,
  compression: "high",
  effects: [],
  blur: 0,
  brightness: 0,
  contrast: 0,
  saturation: 0,
  hue: 0,
  radius: 0,
  rotate: 0,
  flip: "none",
  border: 0,
  borderColor: "#FFFFFF",
  background: "#FFFFFF",
  opacity: 1,
  noise: 0,
  median: 0,
  threshold: 128,
};

const convertParamsToUrl = (params: Params, imageUrl: string): string => {
  const segments: string[] = ["t"];

  // Helper function to check if a value is different from default
  const isDifferent = (key: string, value: any) => {
    if (key === "effects" && Array.isArray(value)) {
      return value.length > 0;
    }
    return value !== defaultParams[key];
  };

  // Add resize parameters only if different from default
  if (params.resize.width !== defaultParams.resize.width) {
    segments.push(`w-${params.resize.width}`);
  }
  if (params.resize.height !== defaultParams.resize.height) {
    segments.push(`h-${params.resize.height}`);
  }

  // Add fit mode only if different from default
  if (params.mode !== defaultParams.mode) {
    segments.push(`mode-${params.mode}`);
  }
  if (params.blur !== defaultParams.blur) {
    segments.push(`blur-${params.blur}`);
  }

  // Add format only if different from default
  if (params.format !== defaultParams.format) {
    segments.push(`f-${params.format}`);
  }

  // Add quality only if different from default
  if (params.quality !== defaultParams.quality) {
    segments.push(`q-${params.quality}`);
  }

  // Add compression only if different from default
  if (params.compression !== defaultParams.compression) {
    segments.push(`comp-${params.compression}`);
  }
  // Add color adjustments only if different from default
  if (params.brightness !== defaultParams.brightness) {
    segments.push(`bright-${params.brightness}`);
  }
  if (params.contrast !== defaultParams.contrast) {
    segments.push(`cont-${params.contrast}`);
  }
  if (params.saturation !== defaultParams.saturation) {
    segments.push(`sat-${params.saturation}`);
  }
  if (params.hue !== defaultParams.hue) {
    segments.push(`hue-${params.hue}`);
  }

  // Add radius only if different from default
  if (params.radius !== defaultParams.radius) {
    segments.push(`r-${params.radius}`);
  }

  // Add rotation only if different from default
  if (params.rotate !== defaultParams.rotate) {
    segments.push(`rot-${params.rotate}`);
  }

  // Add flip only if different from default
  if (params.flip !== defaultParams.flip) {
    segments.push(`flip-${params.flip}`);
  }
  if (
    params.effects.includes("grayscale") ||
    params.effects.includes("negative") ||
    params.effects.includes("sepia")
  ) {
    segments.push(`e-${params.effects}`);
  }

  // Add border only if different from default
  if (params.border !== defaultParams.border) {
    segments.push(`b-${params.border}`);
  }
  if (params.borderColor !== defaultParams.borderColor) {
    segments.push(`bc-${params.borderColor.replace("#", "")}`);
  }

  // Add background only if different from default
  if (params.background !== defaultParams.background) {
    segments.push(`bg-${params.background.replace("#", "")}`);
  }

  // Add opacity only if different from default
  if (params.opacity !== defaultParams.opacity) {
    segments.push(`op-${params.opacity}`);
  }

  // Add advanced effects only if different from default
  if (params.noise !== defaultParams.noise) {
    segments.push(`noise-${params.noise}`);
  }
  if (params.median !== defaultParams.median) {
    segments.push(`median-${params.median}`);
  }
  if (params.threshold !== defaultParams.threshold) {
    segments.push(`thr-${params.threshold}`);
  }

  // Construct the final URL
  const transformString = segments.length > 1 ? segments.join("_") : "";
  const baseUrl = new URL(imageUrl);
  const pathSegments = baseUrl.pathname.split("/").filter(Boolean);

  // Only add transform segment if there are actual transformations
  if (segments.length > 1) {
    pathSegments.splice(-1, 0, transformString);
  }

  return "/" + pathSegments.join("/");
};

const TransformationModal = ({ fileKey }: { fileKey: string }) => {
  const [transformedUrl, setTransformedUrl] = useState<string>("");
  const [prompt, setPrompt] = useState("");
  const { userDetails } = useStore();
  const originalImageUrl = `https://${
    import.meta.env.VITE_CLOUDFRONT_DOMAIN
  }.cloudfront.net/${userDetails.bucketId}/${fileKey}`;
  const [refreshedUrl, setRefreshedUrl] = useState(originalImageUrl);
  const [params, setParams] = useState<Params>({
    resize: {
      width: 800,
      height: 600,
    },
    format: "jpeg",
    mode: "fit",
    quality: 100,
    blur: 0,
    compression: "high",
    effects: [],
    brightness: 0, // Changed from 10 to 0
    contrast: 0, // Changed from 10 to 0
    saturation: 0, // Changed from 10 to 0
    hue: 0, // Changed from 10 to 0
    radius: 0, // Changed from 10 to 0
    rotate: 0, // Changed from 90 to 0
    flip: "none",
    border: 0, // Changed from 5 to 0
    borderColor: "#FFFFFF",
    background: "#FFFFFF",
    opacity: 1, // Changed from 0.8 to 1
    noise: 0, // Changed from 10 to 0
    median: 0, // Changed from 10 to 0
    threshold: 128,
  });

  const handleUserPrompt = async () => {
    try {
      toast.loading("Transforming...", {
        id: "transforming",
        className: "border border-accent/50",
        position: "bottom-left",
      });
      const resp = await TxtLLM(LLMPrompt(prompt));
      if (resp?.includes("t_")) {
        setTransformedUrl(`/${userDetails.bucketId}/${resp}/${fileKey}`);
        toast.success("Transformation successful", { position: "bottom-left" });
      }
    } catch (error) {
      toast.error("Failed to generate transformation");
      console.error(error);
    } finally {
      toast.dismiss("transforming");
    }
  };
  const handleInputChange = (field: keyof Params, value: any) => {
    setParams((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNestedChange = (
    field: keyof Params,
    subfield: keyof ResizeParams,
    value: any
  ) => {
    setParams((prev) => ({
      ...prev,
      [field]: {
        ...prev[field],
        [subfield]: value,
      },
    }));
  };

  useEffect(() => {
    const url = convertParamsToUrl(params, originalImageUrl);
    setTransformedUrl(url);
  }, [params]);

  return (
    <section className="grid md:grid-cols-[500px_auto] divide-x gap-4 *:p-5 md:w-[90vw]">
      <div>
        <div
          style={{ backgroundImage: `url('${refreshedUrl}')` }}
          className="w-full grid place-items-center border-b bg-contain relative bg-center bg-no-repeat h-60 overflow-hidden "
        >
          <LuLoaderCircle className="animate-spin text-4xl -z-10 text-accent" />
          <DevButton
            size="sm"
            className="absolute -translate-x-1/2 left-1/2 bottom-2"
            onClick={() =>
              setRefreshedUrl(
                `https://${
                  import.meta.env.VITE_CLOUDFRONT_DOMAIN
                }.cloudfront.net${transformedUrl}`
              )
            }
          >
            Refresh
          </DevButton>
        </div>

        <br />
        <div className="space-y-3 relative bg-shade/40 p-2 rounded-xl border border-shade">
          <div className="w-full relative overflow-hidden text-wrap bg-slate-800 rounded-xl p-3">
            <DevClipboard
              className="absolute top-2 text-white hover:text-accent text-2xl right-2"
              textClip={`https://${
                import.meta.env.VITE_CLOUDFRONT_DOMAIN
              }.cloudfront.net${transformedUrl}`}
              afterCopy={<IoCopy />}
              beforeCopy={<IoCopyOutline />}
            />
            <a
              target="_blank"
              className="text-blue-500 font-mono hover:underline"
              href={`https://${
                import.meta.env.VITE_CLOUDFRONT_DOMAIN
              }.cloudfront.net${transformedUrl}`}
            >{`https://${
              import.meta.env.VITE_CLOUDFRONT_DOMAIN
            }.cloudfront.net${transformedUrl}`}</a>
          </div>
          <p className="bg-accent/20 flex items-center gap-2 rounded-2xl p-0.5 px-2 text-accent text-sm w-fit">
            Do transformation using AI <FaArrowDown />
          </p>
          <div>
            <DevLaserInput
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  prompt && handleUserPrompt();
                }
              }}
              onChange={(e) => setPrompt(e.target.value)}
              className="!p-1 !pl-2"
              placeholder="Convert this in to Instagram ratio"
              type="text"
              reverseIcon
              icon={
                <DevButton
                  disabled={!prompt}
                  onClick={() => {
                    prompt && handleUserPrompt();
                  }}
                >
                  <MdTransform />
                  Transform
                </DevButton>
              }
            />
          </div>
        </div>
      </div>
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-2">
          <DevInput
            labelName="Width"
            type="number"
            value={params.resize.width}
            onChange={(e) =>
              handleNestedChange("resize", "width", +e.target.value)
            }
          />
          <DevInput
            labelName="Height"
            type="number"
            value={params.resize.height}
            onChange={(e) =>
              handleNestedChange("resize", "height", +e.target.value)
            }
          />
        </div>
        <hr />

        <div className="grid grid-cols-4 gap-2">
          <DevSelect
            labelName="Mode"
            options={[
              { label: "Scale", value: "scale" },
              { label: "Fill", value: "fill" },
              { label: "Fit", value: "fit" },
              { label: "Crop", value: "crop" },
            ]}
            value={params.mode}
            onChange={(e) => handleInputChange("mode", e.target.value)}
          />

          {/* Format Settings */}
          <DevSelect
            labelName="Format"
            options={[
              { label: "JPEG", value: "jpeg" },
              { label: "JPG", value: "jpg" },
              { label: "PNG", value: "png" },
              { label: "WebP", value: "webp" },
              { label: "AVIF", value: "avif" },
              { label: "TIFF", value: "tiff" },
            ]}
            value={params.format}
            onChange={(e) => handleInputChange("format", e.target.value)}
          />

          <DevSelect
            labelName="Compression"
            options={[
              { label: "High", value: "high" },
              { label: "Medium", value: "medium" },
              { label: "Low", value: "low" },
            ]}
            value={params.compression}
            onChange={(e) =>
              handleInputChange(
                "compression",
                e.target.value as "high" | "medium" | "low"
              )
            }
          />
          <DevSelect
            labelName="Flip"
            options={[
              { label: "None", value: "none" },
              { label: "Vertical", value: "v" },
              { label: "Horizontal", value: "h" },
            ]}
            value={params.flip}
            onChange={(e) =>
              handleInputChange("flip", e.target.value as "h" | "v" | "none")
            }
          />
        </div>
        <hr />

        {/* Quality Settings */}
        <div className="grid grid-cols-3 gap-4">
          <DevRangeSlider
            labelName="Quality"
            min={1}
            max={100}
            value={[params.quality]}
            onValueChange={(value) => handleInputChange("quality", value[0])}
          />
          <DevRangeSlider
            labelName="Blur"
            min={0}
            max={20}
            step={0.5}
            value={[params.blur]}
            onValueChange={(value) => handleInputChange("blur", value[0])}
          />

          <div className="bg-shade/30 p-2 rounded-xl grid grid-cols-3 place-items-center border">
            {["grayscale", "negative", "sepia"].map((effect) => (
              <DevCheckbox
                key={effect}
                labelName={effect}
                checked={
                  params.effects.filter((ef) => ef === effect).length > 0
                }
                onChange={(e) => {
                  const updatedEffects = e.target.checked
                    ? [...params.effects, effect]
                    : params.effects.filter((ef) => ef !== effect);
                  handleInputChange("effects", updatedEffects);
                }}
              />
            ))}
          </div>
        </div>

        {/* Brightness, Contrast, Saturation, Hue */}
        <div className="grid grid-cols-3 gap-4 grid-rows-2">
          {["saturation", "hue"].map((prop) => (
            <DevRangeSlider
              key={prop}
              labelName={prop.charAt(0).toUpperCase() + prop.slice(1)}
              min={0}
              max={50}
              step={0.5}
              value={[params[prop]]}
              onValueChange={(value) => handleInputChange(prop, value[0])}
            />
          ))}

          <DevRangeSlider
            labelName="Radius"
            min={0}
            max={100}
            value={[params.radius]}
            onValueChange={(value) => handleInputChange("radius", value[0])}
          />

          <DevRangeSlider
            labelName="Rotate"
            min={0}
            max={360}
            value={[params.rotate]}
            onValueChange={(value) => handleInputChange("rotate", value[0])}
          />
           <DevRangeSlider
            labelName="Opacity"
            min={0}
            max={1}
            step={0.01}
            value={[params.opacity]}
            onValueChange={(value) => handleInputChange("opacity", value[0])}
          />

          <DevRangeSlider
            labelName="Border"
            min={0}
            max={180}
            value={[params.border]}
            onValueChange={(value) => handleInputChange("border", value[0])}
          />
        </div>

        <DevButton
          onClick={() =>
            setRefreshedUrl(
              `https://${
                import.meta.env.VITE_CLOUDFRONT_DOMAIN
              }.cloudfront.net${transformedUrl}`
            )
          }
        >
          <MdTransform /> Apply Transformations
        </DevButton>
      </div>
    </section>
  );
};

export default TransformationModal;
