"use-client";
import React, { useState } from "react";
import NewTitle from "../extra/Title";
import RootLayout from "../component/layout/Layout";
// import AppSetting from "@/component/setting/AppSetting";
// import PaymentSetting from "@/component/setting/PaymentSetting";
// import WithdrawSetting from "@/component/setting/WithdrawSetting";
// import ReportReasonSetting from "@/component/setting/ReportReasonSetting";
// import AdSetting from "@/component/setting/AdSetting";

const SettingPage = () => {
  const [multiButtonSelect, setMultiButtonSelect] = useState("Setting");

  return (
    <>
      <div className="userPage">
        <div>
          <div className="dashboardHeader primeHeader mb-3 p-0">
            <NewTitle
              dayAnalyticsShow={false}
              titleShow={true}
              setMultiButtonSelect={setMultiButtonSelect}
              multiButtonSelect={multiButtonSelect}
              name={`Setting`}
              labelData={[
                "Setting",
                "Ads Setting",
                "Payment Setting",
                "Report Reason",
                "Withdraw Setting",
              ]}
            />
          </div>

          {/* {multiButtonSelect == "Setting" && <AppSetting />}
          {multiButtonSelect == "Ads Setting" && <AdSetting />}
          {multiButtonSelect == "Payment Setting" && <PaymentSetting />}

          {multiButtonSelect == "Withdraw Setting" && <WithdrawSetting />}
          {multiButtonSelect == "Report Reason" && <ReportReasonSetting />} */}
        </div>
      </div>
    </>
  );
};

SettingPage.getLayout = function getLayout(page) {
  return <RootLayout>{page}</RootLayout>;
};

export default SettingPage;
