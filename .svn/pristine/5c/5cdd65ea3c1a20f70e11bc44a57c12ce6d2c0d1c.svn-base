import {
    CButton,
    CFormInput,
    CFormSelect
} from "@coreui/react";

import { useEffect } from "react";

import {
    getEmployeeVehicles,
    createEmployeeVehicle,
    updateEmployeeVehicle
} from "../../../../services/employeeVehicles";


const VehicleStep = ({ state, dispatch, employeeId }) => {

    const { vehicles } = state;

    useEffect(() => {

        const loadVehicles = async () => {

            try {

                const res = await getEmployeeVehicles(employeeId)

                dispatch({
                    type: "SET_VEHICLES",
                    payload: res.data.data?.length
                        ? res.data.data
                        : [{
                            vehicle_details: "",
                            vehicle_registration_number: "",
                            registration_issue_date: "",
                            registration_expiry_date: "",
                            vehicle_category: ""
                        }]
                })

            } catch (err) {
                console.error(err)
            }

        }

        loadVehicles()

    }, [employeeId])


    const saveVehicle = async (vehicle, index) => {

        try {

            let res;

            if (vehicle.id) {

                res = await updateEmployeeVehicle(
                    employeeId,
                    vehicle.id,
                    vehicle
                )

            } else {

                res = await createEmployeeVehicle(
                    employeeId,
                    vehicle
                )

                dispatch({
                    type: "UPDATE_ITEM",
                    section: "vehicles",
                    index: index,
                    field: "id",
                    value: res.data.data.id
                })

            }

        } catch (err) {
            console.error(err)
        }

    }


    const handleNext = async () => {

        const validVehicles = vehicles.filter(
            v => v.vehicle_details || v.vehicle_registration_number
        )

        for (let i = 0; i < validVehicles.length; i++) {
            await saveVehicle(validVehicles[i], i)
        }

        dispatch({
            type: "SET_STEP",
            payload: state.step + 1
        })

    }


    return (

        <div className="step-content">

            <h5 className="mb-3">Vehicle Details</h5>

            {vehicles.map((vehicle, index) => (

                <div key={index} className="border rounded p-3 mb-3">

                    <div className="row g-3">

                        <div className="col-md-6">

                            <CFormInput
                                label="Vehicle Details"
                                value={vehicle.vehicle_details}
                                placeholder="e.g. Honda City"
                                onChange={(e) =>
                                    dispatch({
                                        type: "UPDATE_ITEM",
                                        section: "vehicles",
                                        index: index,
                                        field: "vehicle_details",
                                        value: e.target.value
                                    })
                                }
                            />

                        </div>

                        <div className="col-md-6">

                            <CFormInput
                                label="Registration Number"
                                value={vehicle.vehicle_registration_number}
                                placeholder="e.g. DL01AB1234"
                                onChange={(e) =>
                                    dispatch({
                                        type: "UPDATE_ITEM",
                                        section: "vehicles",
                                        index: index,
                                        field: "vehicle_registration_number",
                                        value: e.target.value
                                    })
                                }
                            />

                        </div>

                        <div className="col-md-4">

                            <CFormSelect
                                label="Vehicle Category"
                                value={vehicle.vehicle_category}
                                onChange={(e) =>
                                    dispatch({
                                        type: "UPDATE_ITEM",
                                        section: "vehicles",
                                        index: index,
                                        field: "vehicle_category",
                                        value: e.target.value
                                    })
                                }
                            >
                                <option value="">Select</option>
                                <option value="CAR">Car</option>
                                <option value="BIKE">Bike</option>
                                <option value="SCOOTER">Scooter</option>
                                <option value="OTHER">Other</option>
                            </CFormSelect>

                        </div>

                        <div className="col-md-4">

                            <CFormInput
                                label="Registration Issue Date"
                                type="date"
                                value={vehicle.registration_issue_date}
                                onChange={(e) =>
                                    dispatch({
                                        type: "UPDATE_ITEM",
                                        section: "vehicles",
                                        index: index,
                                        field: "registration_issue_date",
                                        value: e.target.value
                                    })
                                }
                            />

                        </div>

                        <div className="col-md-4">

                            <CFormInput
                                label="Registration Expiry Date"
                                type="date"
                                value={vehicle.registration_expiry_date}
                                onChange={(e) =>
                                    dispatch({
                                        type: "UPDATE_ITEM",
                                        section: "vehicles",
                                        index: index,
                                        field: "registration_expiry_date",
                                        value: e.target.value
                                    })
                                }
                            />

                        </div>

                    </div>

                    {vehicles.length > 1 && (

                        <div className="text-end mt-2">

                            <CButton
                                color="danger"
                                size="sm"
                                onClick={() =>
                                    dispatch({
                                        type: "REMOVE_ITEM",
                                        section: "vehicles",
                                        index: index
                                    })
                                }
                            >
                                Remove
                            </CButton>

                        </div>

                    )}

                </div>

            ))}

            <CButton
                className="btn btn-outline-primary"
                onClick={() =>
                    dispatch({
                        type: "ADD_ITEM",
                        section: "vehicles",
                        payload: {
                            vehicle_details: "",
                            vehicle_registration_number: "",
                            registration_issue_date: "",
                            registration_expiry_date: "",
                            vehicle_category: ""
                        }
                    })
                }
            >
                + Add Vehicle
            </CButton>


            <div className="d-flex justify-content-end gap-2 mt-4">

                <CButton
                    className="btn btn-outline-secondary"
                    onClick={() =>
                        dispatch({
                            type: "SET_STEP",
                            payload: state.step - 1
                        })
                    }
                >
                    Previous
                </CButton>

                <CButton
                    color="primary"
                    className="btn btn-primary"
                    onClick={handleNext}
                >
                    Save & Next
                </CButton>

            </div>

        </div>

    )

}

export default VehicleStep;