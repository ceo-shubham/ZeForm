import React from "react";
export const runtime = "edge";
export const dynamic = "force-dynamic";
import PublicFormView from "@/components/PublicFormView";

interface Props {
  params: { slug: string };
}

export default function SubdomainFormPage({ params }: Props) {
  return <PublicFormView slug={params.slug} />;
}
