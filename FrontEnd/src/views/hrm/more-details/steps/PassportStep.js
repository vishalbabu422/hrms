import { useEffect } from "react";

import {
    getEmployeePassportVisa,
    createEmployeePassportVisa,
    updateEmployeePassportVisa
} from "../../../../services/employeePassportVisa";

const PassportStep = ({ state, dispatch, employeeId }) => {

    const { passport } = state;

    useEffect(() => {
        const loadPassport = async () => {
            try {

                const res = await getEmployeePassportVisa(employeeId);

                if (res.data.data) {
                    dispatch({
                        type: "SET_PASSPORT",
                        payload: res.data.data
                    });
                }

            } catch (err) {
                console.error(err);
            }
        };

        loadPassport();
    }, [employeeId]);



    const handlePassportChange = (e) => {

        const { name, value } = e.target;

        dispatch({
            type: "UPDATE_PASSPORT",
            field: name,
            value: value
        });

    };


    const savePassport = async () => {

        try {

            if (passport.id) {

                await updateEmployeePassportVisa(
                    employeeId,
                    passport.id,
                    passport
                );

            } else {

                const res = await createEmployeePassportVisa(
                    employeeId,
                    passport
                );

                dispatch({
                    type: "UPDATE_PASSPORT",
                    field: "id",
                    value: res.data.data.id
                });

            }

        } catch (err) {
            console.error(err);
        }

    };


    const handleNext = async () => {

        if (passport.passport_number) {
            await savePassport();
        }

        dispatch({
            type: "SET_STEP",
            payload: state.step + 1
        });

    };


    return (

        <div className="step-content">

            {/* ================= PASSPORT SECTION ================= */}

            <div className="card mb-4 shadow-sm">

                <div className="card-header bg-light fw-semibold">
                    Passport Details
                </div>

                <div className="card-body">

                    <div className="row g-3">

                        <div className="col-md-4">
                            <label className="form-label">Passport Number</label>
                            <input
                                type="text"
                                className="form-control"
                                name="passport_number"
                                value={passport.passport_number || ""}
                                maxLength={30}
                                onChange={handlePassportChange}
                            />
                        </div>


                        <div className="col-md-4">
                            <label className="form-label">Passport Type</label>
                            <select
                                className="form-select"
                                name="passport_type"
                                value={passport.passport_type || ""}
                                onChange={handlePassportChange}
                            >
                                <option value="">Select</option>
                                <option value="Ordinary">Ordinary</option>
                                <option value="Official">Official</option>
                                <option value="Diplomatic">Diplomatic</option>
                            </select>
                        </div>


                        <div className="col-md-4">
                            <label className="form-label">Issuing Country</label>
                            <input
                                type="text"
                                className="form-control"
                                name="passport_issuing_country"
                                value={passport.passport_issuing_country || ""}
                                maxLength={100}
                                onChange={handlePassportChange}
                            />
                        </div>


                        <div className="col-md-4">
                            <label className="form-label">Place of Issue</label>
                            <input
                                type="text"
                                className="form-control"
                                name="passport_place_of_issue"
                                value={passport.passport_place_of_issue || ""}
                                maxLength={100}
                                onChange={handlePassportChange}
                            />
                        </div>


                        <div className="col-md-4">
                            <label className="form-label">Issue Date</label>
                            <input
                                type="date"
                                className="form-control"
                                name="passport_issue_date"
                                value={passport.passport_issue_date || ""}
                                onChange={handlePassportChange}
                            />
                        </div>


                        <div className="col-md-4">
                            <label className="form-label">Expiry Date</label>
                            <input
                                type="date"
                                className="form-control"
                                name="passport_expiry_date"
                                value={passport.passport_expiry_date || ""}
                                onChange={handlePassportChange}
                            />
                        </div>

                    </div>

                </div>

            </div>



            {/* ================= VISA SECTION ================= */}

            <div className="card shadow-sm">

                <div className="card-header bg-light fw-semibold">
                    Visa Details (Optional)
                </div>

                <div className="card-body">

                    <div className="row g-3">

                        <div className="col-md-4">
                            <label className="form-label">Visa Issuing Authority</label>
                            <input
                                type="text"
                                className="form-control"
                                name="visa_issuing_authority"
                                value={passport.visa_issuing_authority || ""}
                                maxLength={150}
                                onChange={handlePassportChange}
                            />
                        </div>


                        <div className="col-md-4">
                            <label className="form-label">Visa Start Date</label>
                            <input
                                type="date"
                                className="form-control"
                                name="visa_start_date"
                                value={passport.visa_start_date || ""}
                                onChange={handlePassportChange}
                            />
                        </div>


                        <div className="col-md-4">
                            <label className="form-label">Visa End Date</label>
                            <input
                                type="date"
                                className="form-control"
                                name="visa_end_date"
                                value={passport.visa_end_date || ""}
                                onChange={handlePassportChange}
                            />
                        </div>

                    </div>

                </div>

            </div>


            {/* ================= NAVIGATION ================= */}

            <div className="d-flex justify-content-end gap-2 mt-4">

                <button
                    className="btn btn-outline-secondary"
                    onClick={() =>
                        dispatch({
                            type: "SET_STEP",
                            payload: state.step - 1
                        })
                    }
                >
                    Previous
                </button>

                <button
                    className="btn btn-primary"
                    onClick={handleNext}
                >
                    Save & Next
                </button>

            </div>

        </div>

    );

};

export default PassportStep;