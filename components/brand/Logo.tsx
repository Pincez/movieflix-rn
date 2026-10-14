import Mark from "../../assets/brand/mark.svg";

/**
 * PincezLogo — square brand mark only.
 * Loaded from assets/brand/mark.svg via react-native-svg-transformer.
 */
export default function PincezLogo({ height = 40 }: { height?: number }) {
  return <Mark width={height} height={height} />;
}
