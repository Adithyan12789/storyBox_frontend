import { useState } from "react";
import RootLayout from "../component/layout/Layout";
import NewTitle from "../extra/Title.js";
import AdsCoinRewardSetting from "../component/reward/AdsCoinRewardSetting.js";
import DailyRewardSetting from "../component/reward/DailyRewardSetting.js";
import RefralBonus from "../component/reward/RefralBonus.js";
import LoginRewardSetting from "../component/reward/LoginRewardSetting.js";
import MultiButton from "../extra/MultiButton.js";

const Reward = () => {
    const [multiButtonSelect, setMultiButtonSelect] = useState("Ads Coin Reward");
    const labelData = [
        "Ads Coin Reward",
        "Daily Coin Reward",
        "Referral Reward",
        // "Engagement Reward",
        "Login Reward",
    ];

    return (
        <div className="userPage">
            <div>
                {/* <div className="dashboardHeader primeHeader mb-3 p-0">
                    <NewTitle
                        dayAnalyticsShow={false}
                        titleShow={true}
                        setMultiButtonSelect={setMultiButtonSelect}
                        multiButtonSelect={multiButtonSelect}
                        name={`Reward`}
                        labelData={[
                            "Ads Coin Reward",
                            "Daily Coin Reward",
                            "Referral Reward",
                            // "Engagement Reward",
                            "Login Reward",
                        ]}
                    />
                </div> */}

                <MultiButton
                    multiButtonSelect={
                        multiButtonSelect ? multiButtonSelect : ""
                    }
                    setMultiButtonSelect={
                        setMultiButtonSelect ? setMultiButtonSelect : ""
                    }
                    label={labelData ? labelData : []}
                />
                {multiButtonSelect == "Ads Coin Reward" && (
                    <AdsCoinRewardSetting />
                )}
                {multiButtonSelect == "Daily Coin Reward" && (
                    <DailyRewardSetting />
                )}
                {multiButtonSelect == "Referral Reward" && <RefralBonus />}
                {/* {multiButtonSelect == "Engagement Reward" && <EngagementSetting />} */}
                {multiButtonSelect == "Login Reward" && <LoginRewardSetting />}
            </div>
        </div>
    );
};
Reward.getLayout = function getLayout(page) {
    return <RootLayout>{page}</RootLayout>;
};
export default Reward;
