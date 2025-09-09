import { useState } from "react";
import RootLayout from "../component/layout/Layout";
import CoinPlanHistoryPage from "../component/coinPlan/CoinPlanHistoryPage";
import NewTitle from "../extra/Title";
import VipPlanHistory from "../component/vipPlan/VipPlanHistory";
import MultiButton from "../extra/MultiButton";

const orderHistory = () => {
    const [multiButtonSelect, setMultiButtonSelect] = useState("Coin Plan");
    const [startDate, setStartDate] = useState("All");
    const [endDate, setEndDate] = useState("All");
    const labelData = ["Coin Plan", "VIP Plan"];
    return (
        <>
            <div className="userPage" style={{ height: "80vh" }}>
                {/* <NewTitle
                    // dayAnalyticsShow={true}
                    // setEndDate={setEndDate}
                    // setStartDate={setStartDate}
                    // startDate={startDate}
                    // endDate={endDate}
                    // title="Plan History"
                    setMultiButtonSelect={setMultiButtonSelect}
                    multiButtonSelect={multiButtonSelect}
                    labelData={["Coin Plan", "Vip Plan"]}
                /> */}
                <MultiButton
                    multiButtonSelect={
                        multiButtonSelect ? multiButtonSelect : ""
                    }
                    setMultiButtonSelect={
                        setMultiButtonSelect ? setMultiButtonSelect : ""
                    }
                    label={labelData ? labelData : []}
                />
                {multiButtonSelect == "Coin Plan" && <CoinPlanHistoryPage />}
                {multiButtonSelect == "VIP Plan" && <VipPlanHistory />}
                {/* {multiButtonSelect == "Ads Setting" && <AdsSettingPage />}
                {multiButtonSelect == "Currency Setting" && <CurrencySettingPage />} */}
            </div>
        </>
    );
};
export default orderHistory;
orderHistory.getLayout = function getLayout(page) {
    return <RootLayout>{page}</RootLayout>;
};
