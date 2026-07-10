import {
    CButton,
    CFormInput,
    CFormTextarea
} from "@coreui/react";

import { useEffect } from "react";

import {
    getEmployeeHobbies,
    createEmployeeHobby,
    updateEmployeeHobby
} from "../../../../services/employeeHobbies";


const HobbiesStep = ({ state, dispatch, employeeId }) => {

    const { hobbies } = state;

    useEffect(() => {

        const loadHobbies = async () => {

            try {

                const res = await getEmployeeHobbies(employeeId)

                dispatch({
                    type: "SET_HOBBIES",
                    payload: res.data.data?.length
                        ? res.data.data
                        : [{ hobby: "", remarks: "" }]
                })

            } catch (err) {
                console.error(err)
            }

        }

        loadHobbies()

    }, [employeeId])


    const saveHobby = async (hobby, index) => {

        try {

            let res;

            if (hobby.id) {

                res = await updateEmployeeHobby(
                    employeeId,
                    hobby.id,
                    hobby
                )

            } else {

                res = await createEmployeeHobby(
                    employeeId,
                    hobby
                )

                dispatch({
                    type: "UPDATE_ITEM",
                    section: "hobbies",
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

        const validHobbies = hobbies.filter(
            h => h.hobby
        )

        for (let i = 0; i < validHobbies.length; i++) {
            await saveHobby(validHobbies[i], i)
        }

        dispatch({
            type: "SET_STEP",
            payload: state.step + 1
        })

    }


    return (

        <div className="step-content">

            <h5 className="mb-3">Hobbies</h5>

            {hobbies.map((hobby, index) => (

                <div key={index} className="border rounded p-3 mb-3">

                    <div className="row g-3">

                        <div className="col-md-6">

                            <CFormInput
                                label="Hobby"
                                value={hobby.hobby}
                                placeholder="e.g. Reading, Cricket, Music"
                                onChange={(e) =>
                                    dispatch({
                                        type: "UPDATE_ITEM",
                                        section: "hobbies",
                                        index: index,
                                        field: "hobby",
                                        value: e.target.value
                                    })
                                }
                            />

                        </div>

                        <div className="col-md-6">

                            <CFormInput
                                label="Remarks"
                                rows={2}
                                value={hobby.remarks}
                                placeholder="Optional remarks"
                                onChange={(e) =>
                                    dispatch({
                                        type: "UPDATE_ITEM",
                                        section: "hobbies",
                                        index: index,
                                        field: "remarks",
                                        value: e.target.value
                                    })
                                }
                            />

                        </div>

                    </div>

                    {hobbies.length > 1 && (

                        <div className="text-end mt-2">

                            <CButton
                                color="danger"
                                size="sm"
                                onClick={() =>
                                    dispatch({
                                        type: "REMOVE_ITEM",
                                        section: "hobbies",
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
                        section: "hobbies",
                        payload: {
                            hobby: "",
                            remarks: ""
                        }
                    })
                }
            >
                + Add Hobby
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

export default HobbiesStep;