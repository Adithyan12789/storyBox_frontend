import { useState } from "react";
import RootLayout from "../component/layout/Layout";
import CoinHistory from "../component/user/CoinHistory";
import ReferralHistory from "../component/user/ReferralHistory";
import CoinPlanHistory from "../component/user/CoinPlanHistory";
import NewTitle from "../extra/Title"
import VipPlanUserHistory from "../component/user/VipPlanUserHistory";

const viewProfileHistory = () => {
    const [multiButtonSelect, setMultiButtonSelect] = useState("Coin History");
    const [startDate, setStartDate] = useState("All"); // Updated type
    const [endDate, setEndDate] = useState("All"); // Updated type
    return (
        <>
            <div className="userPage">
                <NewTitle
                    dayAnalyticsShow={true}
                    setEndDate={setEndDate}
                    setStartDate={setStartDate}
                    startDate={startDate}
                    endDate={endDate}
                    titleShow={false}
                    setMultiButtonSelect={setMultiButtonSelect}
                    multiButtonSelect={multiButtonSelect}
                    labelData={["Coin History", "referral History", "Coin Plan History", "VIP Plan History"]}
                />
                {multiButtonSelect === "Coin History" && (
                    <CoinHistory
                        endDate={endDate}
                        startDate={startDate}
                        multiButtonSelectNavigate={setMultiButtonSelect}
                    />
                )}
                {multiButtonSelect === "referral History" && (
                    <ReferralHistory
                        endDate={endDate}
                        startDate={startDate}
                        multiButtonSelectNavigate={setMultiButtonSelect}
                    />
                )}
                {multiButtonSelect === "Coin Plan History" && (
                    <CoinPlanHistory
                        endDate={endDate}
                        startDate={startDate}
                        multiButtonSelectNavigate={setMultiButtonSelect}
                    />
                )}
                {multiButtonSelect === "VIP Plan History" && (
                    <VipPlanUserHistory
                        endDate={endDate}
                        startDate={startDate}
                        multiButtonSelectNavigate={setMultiButtonSelect}
                    />
                )}
            </div>
        </>
    )
}
export default viewProfileHistory
viewProfileHistory.getLayout = function getLayout(page) {
    return <RootLayout>{page}</RootLayout>;
};