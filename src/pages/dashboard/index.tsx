
import React from "react";
import LeadsPage from "@/components/LeadsPage";
import Layout from "@/components/Common/Layout";

export default function Page() {
  return (
  <>
            <Layout
                title={'Leads Dashboard'}>
                <React.Suspense fallback={<div>Loading...</div>}>
                <LeadsPage />
                </React.Suspense>
            </Layout>

        </>
  )
}
