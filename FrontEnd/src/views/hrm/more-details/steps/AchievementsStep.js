import {
    CButton,
    CFormInput,
    CFormTextarea
} from "@coreui/react";

import { useEffect } from "react";

import {
    getEmployeeAchievements,
    createEmployeeAchievement,
    updateEmployeeAchievement
} from "../../../../services/employeeAchievements";


const AchievementsStep = ({ state, dispatch, employeeId }) => {

    const { achievements } = state;

    useEffect(() => {

        const loadAchievements = async () => {

            try {

                const res = await getEmployeeAchievements(employeeId)

                dispatch({
                    type: "SET_ACHIEVEMENTS",
                    payload: res.data.data?.length
                        ? res.data.data
                        : [{
                            achievement_date: "",
                            achievement: "",
                            achievement_remarks: ""
                        }]
                })

            } catch (err) {
                console.error(err)
            }

        }

        loadAchievements()

    }, [employeeId])


    const saveAchievement = async (achievement, index) => {

        try {

            let res;

            if (achievement.id) {

                res = await updateEmployeeAchievement(
                    employeeId,
                    achievement.id,
                    achievement
                )

            } else {

                res = await createEmployeeAchievement(
                    employeeId,
                    achievement
                )

                dispatch({
                    type: "UPDATE_ITEM",
                    section: "achievements",
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

        const validAchievements = achievements.filter(
            a => a.achievement || a.achievement_date
        )

        for (let i = 0; i < validAchievements.length; i++) {
            await saveAchievement(validAchievements[i], i)
        }

        dispatch({
            type: "SET_STEP",
            payload: state.step + 1
        })

    }


    return (

        <div className="step-content">

            <h5 className="mb-3">Achievements</h5>

            {achievements.map((achievement, index) => (

                <div key={index} className="border rounded p-3 mb-3">

                    <div className="row g-3">

                        <div className="col-md-6">

                            <CFormInput
                                label="Achievement"
                                value={achievement.achievement}
                                onChange={(e) =>
                                    dispatch({
                                        type: "UPDATE_ITEM",
                                        section: "achievements",
                                        index: index,
                                        field: "achievement",
                                        value: e.target.value
                                    })
                                }
                            />

                        </div>

                        <div className="col-md-6">

                            <CFormInput
                                label="Achievement Date"
                                type="date"
                                value={achievement.achievement_date}
                                onChange={(e) =>
                                    dispatch({
                                        type: "UPDATE_ITEM",
                                        section: "achievements",
                                        index: index,
                                        field: "achievement_date",
                                        value: e.target.value
                                    })
                                }
                            />

                        </div>



                        <div className="col-md-12">

                            <CFormTextarea
                                label="Remarks"
                                rows={2}
                                value={achievement.achievement_remarks}
                                onChange={(e) =>
                                    dispatch({
                                        type: "UPDATE_ITEM",
                                        section: "achievements",
                                        index: index,
                                        field: "achievement_remarks",
                                        value: e.target.value
                                    })
                                }
                            />

                        </div>

                    </div>

                    {achievements.length > 1 && (

                        <div className="text-end mt-2">

                            <CButton
                                color="danger"
                                size="sm"
                                onClick={() =>
                                    dispatch({
                                        type: "REMOVE_ITEM",
                                        section: "achievements",
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
                        section: "achievements",
                        payload: {
                            achievement_date: "",
                            achievement: "",
                            achievement_remarks: ""
                        }
                    })
                }
            >
                + Add Achievement
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

export default AchievementsStep;