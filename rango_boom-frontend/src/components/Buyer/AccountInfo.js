import React, { useEffect, useState } from "react";
import Sidebar from './Slidebar';  

export default function AccountInfo() {
  const Access = localStorage.getItem("accessBuyer") || "";
  const [showprofile, setShowprofile] = useState({
    name: "",
    family_name: '',
    email: "",
    address: "",
    phone_number: "",
    zip_code : "",
    age: "",
    meli_code: "",
  });
  const [editField, setEditField] = useState(null);
  const [tempValue, setTempValue] = useState("");


  useEffect(() => {
    // دریافت پروفایل کاربر
    fetch("http://127.0.0.1:8000/api/buyers/profile/", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${Access}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => setShowprofile(data))
      .catch((error) => console.error("Error:", error));

  }, []);

  const handleEdit = (field, value) => {
    setEditField(field);
    setTempValue(value);
  };

  const handleUpdate = () => {
    const updatedProfile = { ...showprofile, [editField]: tempValue };

    fetch("http://127.0.0.1:8000/api/buyers/profile/", {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${Access}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedProfile), 
    })
      .then((res) => res.json())
      .then(() => {
        setShowprofile(updatedProfile);
        setEditField(null);
      })
      .catch((error) => console.error("Error:", error));
  };

  

  return (
    
    <div className="container mt-4">
      <div className="row justify-content-start">
        <div className="col-md-8 col-12">
          <div class="mt-3 mb-1 me-1">
            <strong>  اطلاعات حساب </strong>  
          </div>  

          {/* User account info */}
          <div className="border rounded-3 p-1 border-2 border-success">
            <div className="row">

              <div className="col-md-12 mt-3 mb-3">
                <p class="mt-3 me-3">
                  <i className="bi bi-person-fill mx-3 text-primary"></i>
                  <strong>نام : </strong>
                  {editField === "name" ? (
                    <input
                      type="text"
                      className="form-control d-inline w-50 mx-2"
                      value={tempValue}
                      onChange={(e) => setTempValue(e.target.value)}
                    />
                  ) : (
                    <> {showprofile.name || "ثبت نشده"} </>
                  )}
                  <i
                    className="bi bi-pencil-square text-danger ms-2 cursor-pointer"
                    onClick={() => handleEdit("name", showprofile.name)}
                  ></i>
                </p>

                <p class="mt-3 me-3">
                  <i className="bi bi-person-fill mx-3 text-primary"></i>
                  <strong>نام خانوادگی : </strong>
                  {editField === "family_name" ? (
                    <input
                      type="text"
                      className="form-control d-inline w-50 mx-2"
                      value={tempValue}
                      onChange={(e) => setTempValue(e.target.value)}
                    />
                  ) : (
                    <> {showprofile.family_name || "ثبت نشده"} </>
                  )}
                  <i
                    className="bi bi-pencil-square text-danger ms-2 cursor-pointer"
                    onClick={() => handleEdit("family_name", showprofile.family_name)}
                  ></i>
                </p>

                <p class="mt-3 me-3">
                  <i className="bi bi-person-fill mx-3 text-primary"></i>
                  <strong> کدملی  : </strong>
                  {editField === "meli_code" ? (
                    <input
                      type="text"
                      className="form-control d-inline w-50 mx-2"
                      value={tempValue}
                      onChange={(e) => setTempValue(e.target.value)}
                    />
                  ) : (
                    <> {showprofile.meli_code || "ثبت نشده"} </>
                  )}
                  <i
                    className="bi bi-pencil-square text-danger ms-2 cursor-pointer"
                    onClick={() => handleEdit("meli_code", showprofile.meli_code)}
                  ></i>
                </p>

                <p class="mt-3 me-3">
                  <i className="bi bi-telephone-fill mx-3 text-primary"></i>
                  <strong>شماره تلفن : </strong>
                  
                     {showprofile.phone_number || "ثبت نشده"} 
                  <i
                    className="text-secondary ms-2 cursor-pointer"
                    onClick={() =>
                      handleEdit("phone_number", showprofile.phone_number)
                    }
                  ></i>
                </p>
              </div>

              <div className="col-md-6 mt-3">



              <p class="mt-3">
                  <i className="bi bi-envelope-fill mx-3 text-primary"></i>
                  <strong> سن :</strong>
                  {editField === "age" ? (
                    <input
                      type="age"
                      className="form-control d-inline w-50 mx-2"
                      value={tempValue}
                      onChange={(e) => setTempValue(e.target.value)}
                    />
                  ) : (
                    <> {showprofile.age || "ثبت نشده"} </>
                  )}
                  <i
                    className="bi bi-pencil-square text-danger ms-2 cursor-pointer"
                    onClick={() => handleEdit("age", showprofile.age)}
                  ></i>
              </p>

              <p class="mt-3">
                  <i className="bi bi-envelope-fill mx-3 text-primary"></i>
                  <strong>ایمیل :</strong>
                  {editField === "email" ? (
                    <input
                      type="email"
                      className="form-control d-inline w-50 mx-2"
                      value={tempValue}
                      onChange={(e) => setTempValue(e.target.value)}
                    />
                  ) : (
                    <> {showprofile.email || "ثبت نشده"} </>
                  )}
                  <i
                    className="bi bi-pencil-square text-danger ms-2 cursor-pointer"
                    onClick={() => handleEdit("email", showprofile.email)}
                  ></i>
                </p>

                <p class="mt-3">
                  <i className="bi bi-house-door-fill mx-3 text-primary"></i>
                  <strong> کد پستی :</strong>
                  {editField === "zip_code" ? (
                    <input
                      type="text"
                      className="form-control d-inline w-50 mx-2"
                      value={tempValue}
                      onChange={(e) => setTempValue(e.target.value)}
                    />
                  ) : (
                    <> {showprofile.zip_code || "ثبت نشده"} </>
                  )}
                  <i
                    className="bi bi-pencil-square text-danger ms-2 cursor-pointer"
                    onClick={() => handleEdit("zip_code", showprofile.zip_code)}
                  ></i>
                </p>

                <p class="mt-3">
                  <i className="bi bi-house-door-fill mx-3 text-primary"></i>
                  <strong>آدرس :</strong>
                  {editField === "address" ? (
                    <input
                      type="text"
                      className="form-control d-inline w-50 mx-2"
                      value={tempValue}
                      onChange={(e) => setTempValue(e.target.value)}
                    />
                  ) : (
                    <> {showprofile.address || "ثبت نشده"} </>
                  )}
                  <i
                    className="bi bi-pencil-square text-danger ms-2 cursor-pointer"
                    onClick={() => handleEdit("address", showprofile.address)}
                  ></i>
                </p>

                
              </div>
            </div>

            {editField && (
              <div className="text-end mt-3">
                <button className="btn btn-success" onClick={handleUpdate}>
                  بروزرسانی پروفایل
                </button>
              </div>
            )}
          </div>
          {/* End User Account info */}

        </div>
      </div>

    </div>
    
  );
}
