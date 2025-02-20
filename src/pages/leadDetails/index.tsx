
import React from "react";
import LeadDetailsPage from "@/components/LeadDetailsPage";
import Layout from "@/components/Common/Layout";

export default function Page() {
  return (
  <>
            <Layout
                title={'Leads Details'}>
                <React.Suspense fallback={<div>Loading...</div>}>
                <LeadDetailsPage />
                </React.Suspense>
            </Layout>

        </>
  )
}
