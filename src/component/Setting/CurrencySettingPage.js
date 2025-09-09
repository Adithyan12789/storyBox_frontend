import Button from '../../extra/Button';
import Input from '../../extra/Input';
import AddIcon from '@mui/icons-material/Add';
import Table from '../../extra/Table';
import { openDialog } from '../../store/dialogueSlice';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  deleteCurrency,
  getCurrency,
  handleDefaultCurrency,
} from '../../store/currencySlice';
import dayjs from 'dayjs';
import ToggleSwitch from '../../extra/ToggleSwitch';
import CurrencyDialogue from '../currency/CurrencyDialogue';
import EditIcon from '../../assets/icons/EditBtn.svg';
import Image from 'next/image';
import TrashIcon from '../../assets/icons/trashIcon.svg';
import { warning } from '../../util/Alert';
import { toast } from 'react-toastify';
import Pagination from '../../extra/Pagination';

import { IconEaseIn, IconEdit, IconTrash } from '@tabler/icons-react';

const CurrencySettingPage = () => {
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(20);
  const [data, setData] = useState([]);
  const { currency } = useSelector((state) => state.currency);
  const { dialogueType } = useSelector((state) => state.dialogue);
  
  

  useEffect(() => {
    setData(currency);
  }, [currency]);
  useEffect(() => {
    dispatch(getCurrency({ page: page, size: size }));
  }, []);
  const handleDeleteReward = (row) => {
    
    const data = warning();
    data
      .then((res) => {
        if (res) {
          dispatch(deleteCurrency(row?._id))
            .then((result) => {
              if (result?.payload?.status) {
                console.log('result', result.payload.status);
                toast.success(result?.payload?.message);
                dispatch(getCurrency({ page: page, size: size }));
              } else {
                toast.error(result?.payload?.message);
              }
            })
            .catch((err) => {
              console.log(err);
              toast.error('Failed to delete reward');
            });
        }
      })
      .catch((err) => console.log(err));
  };
  const handleIsActive = (id) => {
    
    dispatch(handleDefaultCurrency(id)).then((res) => {
      if (res?.payload?.status) {
        toast.success(res?.payload?.message);
      } else {
        toast.error(res?.payload?.message);
      }
      setTimeout(() => {
        dispatch(getCurrency({ page: page, size: size }));
      }, 1000);
    });
  };
  const contactUsTable = [
    {
      Header: 'NO',
      body: 'name',
      Cell: ({ index }) => <span>{index + 1}</span>,
    },

    {
      Header: 'Name',
      body: 'name',
      Cell: ({ row }) => <span className="text-capitalize">{row?.name}</span>,
    },

    {
      Header: 'Symbol',
      body: 'symbol',
      Cell: ({ row }) => <span className="text-capitalize">{row?.symbol}</span>,
    },
    {
      Header: 'Currency code',
      body: 'currencyCode',
      Cell: ({ row }) => (
        <span className="text-capitalize">{row?.currencyCode}</span>
      ),
    },
    {
      Header: 'Country code',
      body: 'countryCode',
      Cell: ({ row }) => (
        <span className="text-capitalize">{row?.countryCode}</span>
      ),
    },
    {
      Header: 'Default',
      body: 'isActive',
      Cell: ({ row }) => (
        <ToggleSwitch
          value={row?.isDefault}
          onChange={() => handleIsActive(row?._id)}
          disabled={row?.isDefault}
        />
      ),
    },
    {
      Header: 'Created date',
      body: 'createdAt',
      Cell: ({ row }) => (
        <span className="text-capitalize">
          {row?.createdAt ? dayjs(row?.createdAt).format('DD MMMM YYYY') : ''}
        </span>
      ),
    },
    {
      Header: 'Action',
      body: 'action',
      Cell: ({ row }) => (
        <div className="action-button">
          <Button
            btnIcon={
              <IconEdit className='text-secondary'/>
            }
                onClick={() => {
                  
                  dispatch(
                    openDialog({
                      type: 'currency',
                      data: row,
                    })
                  );
                }}
          />

                    <Button
                        btnIcon={
                            <IconTrash className='text-secondary'/>
                        }
                        onClick={() => handleDeleteReward(row)}
                    />
                </div>
            ),
        },
    ];
    return (
        <>
            {dialogueType === "currency" && <CurrencyDialogue page={page} size={size} />}
           
            <div>
                <div className="user-table real-user mb-3" >
                    <div className="user-table-top">
                        <div style={{ width: "100%" }}>
                            <h5
                                style={{
                    fontWeight: "500",
                    fontSize: "20px",
                    marginTop: "5px",
                    marginBottom: "4px",
                  }}
                            >
                                Currency
                            </h5>
                        </div>
                        <div
                            className="col-6 d-flex justify-content-end"
                            // style={{ paddingRight: "20px", paddingTop: "20px" }}
                        >
                            <div className="ms-auto ">
                                <div className="new-fake-btn d-flex ">
                                    <Button
                                        btnIcon={<AddIcon />}
                                        btnName={"New"}
                                        onClick={() => {
                                            dispatch(openDialog({ type: "currency" }));
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <Table
                        data={data}
                        mapData={contactUsTable}
                        serverPerPage={size}
                        serverPage={page}
                        // handleSelectAll={handleSelectAll}
                        // selectAllChecked={selectAllChecked}
                        type={"server"}
                    />
                    <Pagination
                        type={"server"}
                        activePage={page}
                        rowsPerPage={size}
                        // userTotal={totalUser}
                        setPage={setPage}
                        // handleRowsPerPage={handleRowsPerPage}
                        // handlePageChange={handlePageChange}
                    />
                </div>
            </div>
            
    </>
  );
};
export default CurrencySettingPage;
