import { useEffect, useState } from "react";
import Button from "../../extra/Button";
import Input from "../../extra/Input";
import { getSetting, updateSetting } from "../../store/settingSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";


const RefralBonus = () => {
    const [referralRewardCoins, setReferralRewardCoins] = useState();
    const { setting } = useSelector((state) => state.setting);
    
    const dispatch = useDispatch()
    const [error, setError] = useState({
        referralRewardCoins: "",
    });

    useEffect(() => {
     dispatch(getSetting())
    }, [])
    useEffect(() => {
        setReferralRewardCoins(setting?.referralRewardCoins);
    }, [setting]);
    const handleSubmit = () => {
        
        const referralRewardCoinsValue = parseInt(referralRewardCoins);

        if (referralRewardCoins === "" || referralRewardCoinsValue <= 0) {
            let error = {};

            if (referralRewardCoins === "")
                error.referralRewardCoins = "Amount Is Required !";

            if (referralRewardCoinsValue <= 0)
                error.referralRewardCoins = "Amount Invalid !";

            return setError({ ...error });
        } else {
            let settingDataSubmit = {
                settingId: setting?._id,
                referralRewardCoins: parseInt(referralRewardCoins),
            };

            dispatch(updateSetting(settingDataSubmit)).then((res) => {
                if (res.payload.status) {
                    toast.success(res.payload.message)
                } else {
                    toast.error(res.payload.message)
                }
            })
        }
    };
    return (
        <div className="  userPage withdrawal-page p-0" style={{marginTop: "20px"}}>
            <div className="">
                <div className="">
                    <div className="card1 ">
                        <div className="cardHeader p-3">

                        <div className="align-items-center d-flex justify-content-between w-100">
                                <h5 className="mb-0">Referral Reward</h5>
                                <Button
                                    btnName={"Submit"}
                                    type={"button"}
                                    onClick={handleSubmit}
                                    newClass={"submit-btn"}
                                    style={{
                                        borderRadius: "0.5rem",
                                        width: "88px",
                                        marginLeft: "10px",
                                    }}
                                />
                        </div>
                        </div>
                      
                            <div className=" p-3">
                                <div className="row">
                                    <div className="col-6 m-0 withdrawal-input">
                                        <div className="row">
                                            <div className="col-11">
                                                <Input
                                                    label={`Number Of Member`}
                                                    name={"numberOfMember"}
                                                    type={"number"}
                                                    value={`1`}
                                                    placeholder={"Enter Number of Member"}
                                                    disabled
                                                />
                                            </div>
                                            <p className="align-items-center col-1 d-flex fs-5 justify-content-center mt-3">
                                                =
                                            </p>
                                        </div>
                                    </div>
                                    <div className="col-6 m-0 withdrawal-input">
                                        <Input
                                            label={"Coin  (how many coins for Earning)"}
                                            name={"Coin"}
                                            value={referralRewardCoins}
                                            type={"number"}
                                            errorMessage={error.referralRewardCoins}
                                            placeholder={""}
                                            onChange={(e) => {
                                                setReferralRewardCoins(e.target.value);
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                       
                    </div>
                </div>
            </div>
        </div>
    )
}
export default RefralBonus