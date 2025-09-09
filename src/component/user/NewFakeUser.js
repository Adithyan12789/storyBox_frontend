import React, { useEffect, useState } from "react";
import Button from "../../extra/Button";
import Input from "../../extra/Input";
import Selector from "../../extra/Selector";
import { useSelector } from "react-redux";
import { getCountry, addFakeUser } from "../../store/userSlice";
import ReactSelect from "react-select";


function NewFakeUser() {
  const AgeNumber = Array.from(
    { length: 100 - 18 + 1 },
    (_, index) => index + 18
  );
  const { dialogueData } = useSelector((state) => state.dialogue);
  const { countryData } = useSelector((state) => state.user);
  
  const dispatch = useAppDispatch();
  const [gender, setGender] = useState("");
  const [fullName, setFullName] = useState("");
  const [nickName, setNickName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [email, setEmail] = useState("");
  const [countryDataSelect, setCountryDataSelect] = useState({});
  const [image, setImage] = useState();
  const [imagePath, setImagePath] = useState(
    dialogueData ? dialogueData?.image : ""
  );
  const [age, setAge] = useState("");
  const [bio, setBio] = useState("");
  const [error, setError] = useState({
    fullName: "",
    nickName: "",
    mobileNumber: "",
    email: "",
    gender: "",
    country: "",
    age: "",
    bio: "",
    image: "",
  });

  useEffect(() => {
    dispatch(getCountry());
  }, []);

  const handleSubmit = () => {
    
    if (
      !fullName ||
      !nickName ||
      !mobileNumber ||
      !email ||
      !age ||
      !gender ||
      !countryDataSelect ||
      !image
    ) {
      let error = {};
      if (!fullName) error.fullName = "Name Is Required !";
      if (!nickName) error.nickName = "User name Is Required !";
      if (!mobileNumber) error.mobileNumber = "Mobile Number Is Required !";
      if (!email) {
        error.email = "Email Is Required !";
      }
      if (!gender) error.gender = "Gender Is Required !";
      if (!image) error.image = "Image Is Required !";
      if (!bio) error.bio = "Bio Is Required !";
      if (!age) error.age = "Age is required !";
      if (!countryDataSelect) error.country = "Country is required !";
      if (!age) error.age = "Age is required !";

      return setError({ ...error });
    } else {
      const formData = new FormData();
      formData.append("name", fullName);
      formData.append("userName", nickName);
      formData.append("gender", gender);
      formData.append("age", age);
      formData.append("image", image);
      formData.append("bio", bio);
      formData.append("country", countryDataSelect?.name?.common);
      formData.append("countryFlagImage", countryDataSelect?.flags?.png);
      formData.append("email", email);
      formData.append("mobileNumber", mobileNumber);
      const payload = {
        data: formData,
      };

      dispatch(addFakeUser(payload));
      dispatch(closeDialog());
    }
  };

  const handleImage = (e) => {
    if (e.target.files) {
      setImage(e.target.files[0]);
      setImagePath(URL.createObjectURL(e.target.files[0]));
      setError({ ...error, image: "" });
    }
  };

  const CustomOption = ({ innerProps, label, data }) => (
    <div
      {...innerProps}
      className="country-optionList my-2"
      style={{ cursor: "pointer" }}
    >
      <img
        src={data?.flags?.png && data?.flags?.png}
        alt={label}
        height={30}
        width={30}
      />
      <span className="ms-2">{data?.name?.common && data?.name?.common}</span>
    </div>
  );

  const handleSelectChange = (selected) => {
    setCountryDataSelect(selected);

    if (!selected) {
      return setError({
        ...error,
        country: `Country Is Required`,
      });
    } else {
      return setError({
        ...error,
        country: "",
      });
    }
  };

  return (
    <div>
      <div className="general-setting fake-user ">
        <div className=" userSettingBox">
          <form>
            <div className="row d-flex  align-items-center">
              <div className="col-12 col-sm-6 col-md-6 col-lg-6 mb-1 mb-sm-0">
                <h5 className="mb-0">Create Fake User</h5>
              </div>
              <div className="col-12 col-sm-6 col-md-6 col-lg-6 d-flex justify-content-end">
                <Button
                  btnName={"Back"}
                  newClass={"back-btn"}
                  onClick={() => dispatch(closeDialog())}
                />
              </div>
              <div
                className="col-12 d-flex justify-content-end align-items-center"
                style={{
                  paddingTop: "8px",
                  marginTop: "11px",
                  borderTop: "1px solid #c9c9c9",
                }}
              >
                <Button
                  newClass={"submit-btn"}
                  btnName={"Submit"}
                  type={"button"}
                  onClick={handleSubmit}
                />
              </div>
              <div className="row mt-3">
                <div className="col-12 col-sm-12 col-md-6 col-lg-6 mt-2">
                  <Input
                    label={"Name"}
                    name={"name"}
                    placeholder={"Enter Details..."}
                    errorMessage={error.fullName && error.fullName}
                    defaultValue={dialogueData && dialogueData.name}
                    onChange={(e) => {
                      setFullName(e.target.value);
                      if (!e.target.value) {
                        return setError({
                          ...error,
                          fullName: `Name Is Required`,
                        });
                      } else {
                        return setError({
                          ...error,
                          fullName: "",
                        });
                      }
                    }}
                  />
                </div>
                <div className="col-12 col-sm-12 col-md-6 col-lg-6 mt-2">
                  <Input
                    label={"User name"}
                    name={"userName"}
                    placeholder={"Enter Details..."}
                    errorMessage={error.nickName && error.nickName}
                    defaultValue={dialogueData && dialogueData.userName}
                    onChange={(e) => {
                      setNickName(e.target.value);
                      if (!e.target.value) {
                        return setError({
                          ...error,
                          nickName: `User name Is Required`,
                        });
                      } else {
                        return setError({
                          ...error,
                          nickName: "",
                        });
                      }
                    }}
                  />
                </div>
                <div className="col-12 col-sm-12 col-md-6 col-lg-6 mt-2">
                  <Input
                    label={"E-mail Address"}
                    name={"email"}
                    errorMessage={error.email && error.email}
                    defaultValue={dialogueData && dialogueData.email}
                    placeholder={"Enter Details..."}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (!e.target.value) {
                        return setError({
                          ...error,
                          email: `Email Is Required`,
                        });
                      } else {
                        return setError({
                          ...error,
                          email: "",
                        });
                      }
                    }}
                  />
                </div>

                <div className="col-12 col-sm-12 col-md-6 col-lg-6 mt-2">
                  <Input
                    label={"Mobile Number"}
                    name={"mobileNumber"}
                    type={"number"}
                    placeholder={"Enter Details..."}
                    errorMessage={error.mobileNumber && error.mobileNumber}
                    defaultValue={dialogueData && dialogueData.mobileNumber}
                    onChange={(e) => {
                      setMobileNumber(e.target.value);
                      if (!e.target.value) {
                        return setError({
                          ...error,
                          mobileNumber: `Mobile Number Is Required`,
                        });
                      } else {
                        return setError({
                          ...error,
                          mobileNumber: "",
                        });
                      }
                    }}
                  />
                </div>

                <div className="col-12 col-sm-12 col-md-6 col-lg-6 mt-2">
                  <Selector
                    label={"Gender"}
                    selectValue={gender}
                    placeholder={"Select Gender"}
                    selectData={["Male", "Female"]}
                    errorMessage={error.gender && error.gender}
                    defaultValue={dialogueData && dialogueData.gender}
                    onChange={(e) => {
                      setGender(e.target.value);
                      if (!e.target.value) {
                        return setError({
                          ...error,
                          gender: `Gender Is Required`,
                        });
                      } else {
                        return setError({
                          ...error,
                          gender: "",
                        });
                      }
                    }}
                  />
                </div>
                <div className="col-12 col-sm-12 col-md-6 col-lg-6 mt-2">
                  <Selector
                    label={"Age"}
                    selectValue={age}
                    placeholder={"Select Age"}
                    errorMessage={error.age && error.age}
                    defaultValue={dialogueData && dialogueData.age}
                    selectData={AgeNumber}
                    onChange={(e) => {
                      setAge(e.target.value);
                      if (!e.target.value) {
                        return setError({
                          ...error,
                          age: `Age Is Required`,
                        });
                      } else {
                        return setError({
                          ...error,
                          age: "",
                        });
                      }
                    }}
                  />
                </div>
                <div className="col-12 col-sm-12 col-md-6 col-lg-6 mt-2">
                  <div className="custom-input">
                    <label>Country</label>
                    <ReactSelect
                      options={countryData || []}
                      value={countryDataSelect}
                      isClearable={false}
                      onChange={(selected) => handleSelectChange(selected)}
                      getOptionValue={(option) => option?.name?.common}
                      className="mt-2"
                      formatOptionLabel={(option) => (
                        <div className="optionShow-option">
                          <img
                            height={30}
                            width={30}
                            src={option?.flags?.png ? option?.flags?.png : ""}
                          />
                          <span className="ms-2">
                            {option?.name?.common ? option?.name?.common : ""}
                          </span>
                        </div>
                      )}
                      components={{
                        Option: CustomOption,
                      }}
                    />
                  </div>
                </div>
                <div className="col-12 col-sm-12 col-md-6 col-lg-6 mt-2 ">
                  <Input
                    type={"file"}
                    label={"Image"}
                    accept={"image/png, image/jpeg"}
                    errorMessage={error.image && error.image}
                    onChange={handleImage}
                  />
                </div>

                <div className="col-12 col-sm-12 col-md-6 col-lg-6 mt-2 fake-create-img">
                  <img
                    src={imagePath && imagePath}
                    alt=""
                    draggable={false}
                    className={`${(!imagePath || imagePath === "") && "d-none"
                      } `}
                    data-class={`showImage`}
                    style={{ width: "100px", height: "100px" }}
                  />
                </div>
                <div className="col-12 mt-3 text-about">
                  <label className="label-form">Bio</label>
                  <textarea
                    cols={6}
                    rows={6}
                    value={bio}
                    onChange={(e) => {
                      setBio(e.target.value);
                      if (!e.target.value) {
                        return setError({
                          ...error,
                          bio: `Bio Is Required`,
                        });
                      } else {
                        return setError({
                          ...error,
                          bio: "",
                        });
                      }
                    }}
                  ></textarea>
                  {error.bio && (
                    <p className="errorMessage">{error.bio && error.bio}</p>
                  )}
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default NewFakeUser;
