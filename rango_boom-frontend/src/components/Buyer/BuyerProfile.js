import React, { useEffect, useState } from "react";

export default function Dashboard() {
  const Access = localStorage.getItem("accessBuyer") || "";
  const [showprofile, setShowprofile] = useState({
    name: "",
    email: "",
    address: "",
    phone_number: "",
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
          <h4 className="mb-3">پروفایل کاربر</h4>
          <div className="border rounded-3 p-4 border-2 border-primary">
            <div className="row">
              <div className="col-md-6">
                <p>
                  <i className="bi bi-person-fill mx-2 text-primary"></i>
                  <strong>نام:</strong>
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
                    className="bi bi-pencil-square text-secondary ms-2 cursor-pointer"
                    onClick={() => handleEdit("name", showprofile.name)}
                  ></i>
                </p>

                <p>
                  <i className="bi bi-envelope-fill mx-2 text-primary"></i>
                  <strong>ایمیل:</strong>
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
                    className="bi bi-pencil-square text-secondary ms-2 cursor-pointer"
                    onClick={() => handleEdit("email", showprofile.email)}
                  ></i>
                </p>
              </div>

              <div className="col-md-6">
                <p>
                  <i className="bi bi-house-door-fill mx-2 text-primary"></i>
                  <strong>آدرس:</strong>
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
                    className="bi bi-pencil-square text-secondary ms-2 cursor-pointer"
                    onClick={() => handleEdit("address", showprofile.address)}
                  ></i>
                </p>

                <p>
                  <i className="bi bi-telephone-fill mx-2 text-primary"></i>
                  <strong>شماره تلفن:</strong>
                  {editField === "phone_number" ? (
                    <input
                      type="text"
                      className="form-control d-inline w-50 mx-2"
                      value={tempValue}
                      onChange={(e) => setTempValue(e.target.value)}
                    />
                  ) : (
                    <> {showprofile.phone_number || "ثبت نشده"} </>
                  )}
                  <i
                    className="bi bi-pencil-square text-secondary ms-2 cursor-pointer"
                    onClick={() =>
                      handleEdit("phone_number", showprofile.phone_number)
                    }
                  ></i>
                </p>
              </div>
            </div>

            {editField && (
              <div className="text-end mt-3">
                <button className="btn btn-primary" onClick={handleUpdate}>
                  بروزرسانی پروفایل
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
