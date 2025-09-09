import { Box, Modal, Typography } from "@mui/material"
import { useDispatch, useSelector } from "react-redux"
import { closeDialog } from "../../store/dialogueSlice"
import Input from "../../extra/Input";
import Button from "../../extra/Button";
import { useEffect, useState } from "react";
import { addCurrency, getCurrency, updateCurrency } from "../../store/currencySlice";
import { toast } from "react-toastify";

const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 600,
    backgroundColor: "background.paper",
    borderRadius: "5px",
    border: "1px solid #C9C9C9",
    boxShadow: "24px",
    // padding: "19px",
};
const CurrencyDialogue = ({ page, size }) => {
    const { dialogue: open } = useSelector((state) => state.dialogue)
    const { dialogueData } = useSelector((state) => state.dialogue)
    const [name, setName] = useState();
    const [symbol, setSymbol] = useState();
    const [currencyCode, setCurrencyCode] = useState();
    const [countryCode, setCountryCode] = useState();
    

    const dispatch = useDispatch()
    const handleCloseAds = () => {
        dispatch(closeDialog())
    }
    const [error, setError] = useState({
        name: "",
        symbol: "",
        countryCode: "",
        currencyCode: "",
    });
    useEffect(() => {
        if (dialogueData) {
            setName(dialogueData?.name)
            setSymbol(dialogueData?.symbol)
            setCurrencyCode(dialogueData?.currencyCode)
            setCountryCode(dialogueData?.countryCode)
        }
    }, [dialogueData])
    const handleSubmit = () => {
        

        if (!name || !symbol || !currencyCode || !countryCode) {
            let error = {};
            if (!name) error.name = "Name Is Required !";

            if (!symbol) error.symbol = "Symbol Is Required !";
            if (!currencyCode) error.currencyCode = "CurrencyCode is required !";
            if (!countryCode) error.countryCode = "CountryCode is required !";

            return setError({ ...error });
        } else {
            const addContactUs = {
                name: name,
                symbol: symbol,
                currencyCode: currencyCode,
                countryCode: countryCode,
                currencyId: dialogueData?._id,
            };
            if (dialogueData) {
                
                dispatch(updateCurrency(addContactUs))
                    .then((res) => {
                        if (res?.payload?.status) {
                            toast.success(res?.payload?.message);
                            dispatch(closeDialog())
                            dispatch(getCurrency({ page, size }))
                        } else {
                            toast.error(res?.payload?.message)
                        }
                    })
            } else {
                dispatch(addCurrency(addContactUs))
                    .then((res) => {
                        if (res?.payload?.status) {
                            toast.success(res?.payload?.message);
                            dispatch(closeDialog())
                            dispatch(getCurrency({ page, size }))
                        } else {
                            toast.error(res?.payload?.message)
                        }
                    })
            }
        }
    };

    return (
        <div>
            <Modal
                open={open}
                onClose={handleCloseAds}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style} className="">
                   
                    <div className="model-header">
            <p className="m-0">
               {dialogueData ? "Edit Currency" : "Add Currency"}
            </p>
          </div>
           <div className="model-header">
                    <form>
                        <div className="row sound-add-box" style={{ overflowX: "hidden" }}>
                            <Input
                                type={"text"}
                                label={"Name"}
                                errorMessage={error.name && error.name}
                                onChange={(e) => {
                                    setName(e.target.value);
                                    if (!e.target.value) {
                                        return setError({
                                            ...error,
                                            name: `Name Is Required`,
                                        });
                                    } else {
                                        return setError({
                                            ...error,
                                            name: "",
                                        });
                                    }
                                }}
                                name={"name"}
                                value={name}
                            />
                            {/* {error?.name && <span className="error mb-2" style={{ fontSize: "15px", color: "red" }}>{error?.name}</span>} */}
                            <Input
                                // type={"number"}
                                label={"Symbol"}
                                name={"symbol"}
                                errorMessage={error.symbol && error.symbol}

                                onChange={(e) => {
                                    setSymbol(e.target.value);
                                    if (!e.target.value) {
                                        return setError({
                                            ...error,
                                            symbol: `symbol Is Required`,
                                        });
                                    } else {
                                        return setError({
                                            ...error,
                                            symbol: "",
                                        });
                                    }
                                }}
                                value={symbol}
                            />
                            {/* {errors?.adDisplayInterval && <span className="error mb-2" style={{ fontSize: "15px", color: "red" }}>{errors?.adDisplayInterval}</span>} */}
                            <Input
                                // type={"number"}
                                label={"Currency Code"}
                                name={"currencyCode"}
                                errorMessage={error.currencyCode && error.currencyCode}
                                onChange={(e) => {
                                    setCurrencyCode(e.target.value);
                                    if (!e.target.value) {
                                        return setError({
                                            ...error,
                                            currencyCode: `CurrencyCode is required`,
                                        });
                                    } else {
                                        return setError({
                                            ...error,
                                            currencyCode: "",
                                        });
                                    }
                                }}
                                value={currencyCode}
                            />
                            <Input
                                // type={"number"}
                                label={"Country Code"}
                                errorMessage={error.countryCode && error.countryCode}
                                name={"countryCode"}
                                onChange={(e) => {
                                    setCountryCode(e.target.value);
                                    if (!e.target.value) {
                                        return setError({
                                            ...error,
                                            countryCode: `CountryCode is required`,
                                        });
                                    } else {
                                        return setError({
                                            ...error,
                                            countryCode: "",
                                        });
                                    }
                                }}
                                value={countryCode}
                            />
                            {/* {errors?.coinEarnedFromAd && <span className="error mb-2" style={{ fontSize: "15px", color: "red" }}>{errors?.coinEarnedFromAd}</span>} */}

                            
                        </div>
                    </form>
           </div>
            <div className="model-footer">
                                <div className="m-3 d-flex justify-content-end">
                                <Button
                                    onClick={handleCloseAds}
                                    btnName={"Close"}
                                    newClass={"close-model-btn"}
                                />
                                <Button
                                    onClick={handleSubmit}
                                    btnName={"Submit"}
                                    type={"button"}
                                    newClass={"submit-btn"}
                                    style={{
                                        borderRadius: "0.5rem",
                                        width: "80px",
                                        marginLeft: "10px",
                                    }}
                                />
                            </div>
            </div>
                </Box>
            </Modal>
        </div>
    )
}
export default CurrencyDialogue