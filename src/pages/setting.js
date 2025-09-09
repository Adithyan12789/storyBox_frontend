import { useEffect, useState } from 'react';
import RootLayout from '../component/layout/Layout';
import NewTitle from '../extra/Title';
import SettingPage from '../component/Setting/SettingPage';
import { getSetting } from '../store/settingSlice';
import { useDispatch } from 'react-redux';
import PaymentSettingPage from '../component/Setting/PaymentSettingPage';
import AdsSettingPage from '../component/Setting/AdsSettingPage';
import CurrencySettingPage from '../component/Setting/CurrencySettingPage';
import MultiButton from '../extra/MultiButton';
import ReportReasonSetting from '../component/Setting/ReportReasonSetting';
import StorageSettingPage from "../component/Setting/StorageSettingPage";
import { useSelector } from 'react-redux';

const Setting = () => {
  const [multiButtonSelect, setMultiButtonSelect] = useState('Setting');
  
  const labelData = [
    'Setting',
    "Storage Setting",
    'Payment Setting',
    'Ads Setting',
    'Report Reason',
    'Currency Setting',
  ];

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getSetting());
  }, [dispatch]);

  return (
    <>
      <div className="userPage">
        {/* <NewTitle
                    title="Setting"
                    setMultiButtonSelect={setMultiButtonSelect}
                    multiButtonSelect={multiButtonSelect}
                    labelData={["Setting", "Payment Setting", "Ads Setting", "Currency Setting"]}
                /> */}
        <MultiButton
          multiButtonSelect={multiButtonSelect ? multiButtonSelect : ''}
          setMultiButtonSelect={
            setMultiButtonSelect ? setMultiButtonSelect : ''
          }
          label={labelData ? labelData : []}
        />
        {multiButtonSelect == 'Setting' && <SettingPage />}
        {multiButtonSelect == "Storage Setting" && <StorageSettingPage />}
        {multiButtonSelect == 'Payment Setting' && <PaymentSettingPage />}
        {multiButtonSelect == 'Ads Setting' && <AdsSettingPage />}
        {multiButtonSelect == 'Currency Setting' && <CurrencySettingPage />}
        {multiButtonSelect === 'Report Reason' && <ReportReasonSetting />}
      </div>
    </>
  );

  // nonvip access setting
};
export default Setting;
Setting.getLayout = function getLayout(page) {
  return <RootLayout>{page}</RootLayout>;
};
