import React from "react";
export const runtime = "edge";
import PublicFormView from "@/components/PublicFormView";

interface Props {
  params: { slug: string };
}

export default function DirectPathFormPage({ params }: Props) {
  return <PublicFormView slug={params.slug} />;
}
