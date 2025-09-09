import { useState, ChangeEvent, KeyboardEvent } from "react";
import Button from "./Button";
import SearchIcon from "../assets/icons/search.svg";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

export default function Searching(props) {
  const [search, setSearch] = useState("");

  const {
    data,
    setData,
    type,
    serverSearching,
    setSearchData,
    placeholder,
    button,
    newClass,
    actionShow,
    paginationSubmitButton,
    setActionPagination,
    actionPagination,
    customSelectDataShow,
    customSelectData,
    label,
    actionPaginationDataCustom,
  } = props;

  const handleSearch = (event) => {
    event.preventDefault();

    const searchValue = search ? search : event?.target?.value?.toLowerCase();
    const getLowerCaseSearch = searchValue?.toLowerCase();

    if (getLowerCaseSearch !== undefined) {
      if (type === "client") {
        if (getLowerCaseSearch) {
          const filteredData = data.filter((item) => {
            return Object.keys(item).some((key) => {
              if (key === "_id" || key === "updatedAt" || key === "createdAt") {
                return false;
              }
              const itemValue = item[key];
              if (typeof itemValue === "string") {
                return itemValue.toLowerCase().indexOf(getLowerCaseSearch) > -1;
              } else if (typeof itemValue === "number") {
                return itemValue.toString().indexOf(getLowerCaseSearch) > -1;
              } else if (typeof itemValue === "object" && itemValue !== null) {
                return Object.values(itemValue).some((nestedValue) => {
                  if (typeof nestedValue === "string") {
                    return (
                      nestedValue.toLowerCase().indexOf(getLowerCaseSearch) > -1
                    );
                  }
                  return false;
                });
              }
              return false;
            });
          });
          setData(filteredData); // Update the filteredData state
        } else {
          setData(data); // Reset the filteredData state to the original data
        }
      } else {
        // For other types, implement the serverSearching function
        serverSearching ? serverSearching(searchValue) : "";
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch(e);
    }
  };

  const paginationActionData = actionPaginationDataCustom
    ? actionPaginationDataCustom
    : ["Block", "Unblock", "Delete"];

  return (
    <>
      <div className="row search-action" style={{ paddingRight: "3px" }}>
        <div
          className={`${
            actionShow === false
              ? "col-12"
              : "col-12 col-lg-6 col-md-6 col-sm-12"
          } `}
        >
          <div className="searching-box" style={{ float: "right" }}>
            <div
              className={`prime-input search-input-box m-0 ${newClass}`}
              style={{ borderRadius: "62px" }}
            >
              {label && <label
                // className="mb-3 mt-3"
                style={{ fontSize: "15px", fontWeight: "400", color: "unset" }}
              >
                {label}
              </label>}
              <input
                type="search"
                autoComplete="false"
                placeholder={placeholder}
                aria-describedby="button-addon4"
                className="form-input searchBarBorderr"
                style={{
                  borderRadius: "62px",
                  // borderBottomRightRadius: "0px",
                  // borderTopRightRadius: "0px",
                  height: "56px",
                }}
                onChange={(e) => {
                  const inputValue = e.target.value;
                  if (!inputValue) {
                    handleSearch(e);
                    serverSearching ? setSearchData("") : setData(data);
                  }
                  handleSearch(e);
                }}
                onKeyPress={handleKeyPress}
              />
              {button && (
                <Button
                  type="button"
                  btnIcon={<SearchIcon />}
                  newClass={`themeBtn text-center fs-6  searchBtn text-white `}
                  onClick={(e) => handleSearch(e)}
                />
              )}
            </div>
          </div>
        </div>
        {actionShow === false ? (
          ""
        ) : (
          <>
            <div className="col-12 col-lg-6 col-md-6 col-sm-12  pagination-select p-0">
              <div className="d-flex align-items-center justify-content-end w-100 pagination-box">
                <div className="pagination-submit me-3">
                  <FormControl>
                    <InputLabel
                      id="demo-simple-select-label"
                      style={{
                        fontWeight: "500",
                        fontSize: "17px",
                        marginBottom: "10px",
                      }}
                    >
                      Action{" "}
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={actionPagination}
                      label="Action"
                      onChange={(e) => setActionPagination(e.target.value)}
                    >
                      {customSelectDataShow
                        ? customSelectData?.map((item) => {
                            return (
                              <MenuItem value={item?.toLowerCase()} key={item}>
                                {item}
                              </MenuItem>
                            );
                          })
                        : paginationActionData?.map((item) => {
                            return (
                              <MenuItem value={item?.toLowerCase()} key={item}>
                                {item}
                              </MenuItem>
                            );
                          })}
                    </Select>
                  </FormControl>
                </div>
                <Button
                  newClass={"submit-btn"}
                  onClick={paginationSubmitButton}
                  btnName={"Submit"}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
