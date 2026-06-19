import React from 'react'
import { CContainer, CRow, CCol, CCard, CCardBody, CButton } from '@coreui/react'
import LeaveTrendChart from './LeaveTrendChart'
import CIcon from '@coreui/icons-react'
import PayrollTrendChart from './PayrollTrendChart'
import WorkOrderTrendChart from './WorkOrderTrendChart'
import WorkOrderPieChart from './WorkOrderPieChart'
import {
  cilPeople,
  cilBriefcase,
  cilBuilding,
  cilDollar,
  cilDescription,
  cilUserPlus,
  cilList,
  cilChartLine,
  cilArrowCircleRight,
} from '@coreui/icons'

import './Dashboard.css'

const Dashboard = () => {
  const stats = [
    {
      title: 'Total Employees',
      value: '1,248',

      icon: cilPeople,
      theme: 'purple',
    },
    {
      title: 'Total Workorders',
      value: '1,102',

      icon: cilBriefcase,
      theme: 'blue',
    },
    {
      title: 'Active Workorders',
      value: '124',

      icon: cilChartLine,
      theme: 'green',
    },
    {
      title: 'Active Vendors',
      value: '156',

      icon: cilBuilding,
      theme: 'teal',
    },
    {
      title: 'Monthly Payroll',
      value: '₹3.85 Cr',

      icon: cilDollar,
      theme: 'orange',
    },
  ]

  return (
    <CContainer fluid className="dashboard-container mb-2">
      {/* KPI CARDS */}

      <CRow className="g-3 mb-4">
        {stats.map((item, index) => (
          <CCol key={index} className="five-col">
            <CCard className={`kpi-card ${item.theme}`}>
              <CCardBody className="kpi-body">
                <div>
                  <div className="kpi-title">{item.title}</div>

                  <div className="kpi-value">{item.value}</div>

                  <div className="kpi-subtitle">{item.subtitle}</div>
                </div>

                <div className="kpi-icon">
                  <CIcon icon={item.icon} />
                </div>
              </CCardBody>
            </CCard>
          </CCol>
        ))}
      </CRow>

      {/* MIDDLE SECTION */}

      <CRow className="g-3 mb-4">
        {/* ORGANIZATION */}
        <CCol lg={12}>
          <CCard className="dashboard-card">
            <CCardBody>
              <h6 className="overview-heading">Organization Overview</h6>
              <CRow className="g-3">
              <CCol xl={2} lg={3} md={4} sm={6} xs={12}>
                  <CCard className="mini-kpi blue">
                    <CCardBody className="mini-kpi-body">
                      <div>
                        <div className="mini-title">Resource Rates Defined</div>
                        <div className="mini-value">212</div>
                      </div>

                      <div className="mini-icon">
                        <CIcon icon={cilChartLine} />
                      </div>
                    </CCardBody>
                  </CCard>
                </CCol>

               <CCol xl={2} lg={3} md={4} sm={6} xs={12}>
                  <CCard className="mini-kpi purple">
                    <CCardBody className="mini-kpi-body">
                      <div>
                        <div className="mini-title">Total Divisions</div>
                        <div className="mini-value">16</div>
                      </div>

                      <div className="mini-icon">
                        <CIcon icon={cilBriefcase} />
                      </div>
                    </CCardBody>
                  </CCard>
                </CCol>

              <CCol xl={2} lg={3} md={4} sm={6} xs={12}>
                  <CCard className="mini-kpi orange">
                    <CCardBody className="mini-kpi-body">
                      <div>
                        <div className="mini-title">Total Designations</div>
                        <div className="mini-value">98</div>
                      </div>

                      <div className="mini-icon">
                        <CIcon icon={cilUserPlus} />
                      </div>
                    </CCardBody>
                  </CCard>
                </CCol>

                <CCol xl={2} lg={3} md={4} sm={6} xs={12}>
                  <CCard className="mini-kpi blue">
                    <CCardBody className="mini-kpi-body">
                      <div>
                        <div className="mini-title">Total Companies</div>
                        <div className="mini-value">198</div>
                      </div>

                      <div className="mini-icon">
                        <CIcon icon={cilBuilding} />
                      </div>
                    </CCardBody>
                  </CCard>
                </CCol>

            <CCol xl={2} lg={3} md={4} sm={6} xs={12}>
                  <CCard className="mini-kpi orange">
                    <CCardBody className="mini-kpi-body">
                      <div>
                        <div className="mini-title">Active Salary Structures</div>
                        <div className="mini-value">24</div>
                      </div>

                      <div className="mini-icon">
                        <CIcon icon={cilDollar} />
                      </div>
                    </CCardBody>
                  </CCard>
                </CCol>

                <CCol lg={2}>
                  <CCard className="mini-kpi purple">
                    <CCardBody className="mini-kpi-body">
                      <div>
                        <div className="mini-title">Active Roles</div>
                        <div className="mini-value">28</div>
                      </div>

                      <div className="mini-icon">
                        <CIcon icon={cilPeople} />
                      </div>
                    </CCardBody>
                  </CCard>
                </CCol>

                <CCol lg={2}>
                  <CCard className="mini-kpi green">
                    <CCardBody className="mini-kpi-body">
                      <div>
                        <div className="mini-title">Users Assigned</div>
                        <div className="mini-value">124</div>
                      </div>

                      <div className="mini-icon">
                        <CIcon icon={cilPeople} />
                      </div>
                    </CCardBody>
                  </CCard>
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>
        </CCol>

        {/* Work Order Analytics */}
        <CRow className="g-3 ">
          <CCol xl={4} lg={6} md={12}>
            <CCard className="dashboard-card chart-card">
              <CCardBody>
                <div className="card-header-shortcut">
                  <h6>Work Order Analytics</h6>
                </div>

                <div className="workorder-layout">
                  <div className="workorder-donut">
                    <WorkOrderPieChart />
                  </div>

                  <div className="workorder-stats">
                    <div className="wo-row">
                      <span className="wo-dot green"></span>
                      <span>Completed</span>
                      <strong>106</strong>
                      <span>45%</span>
                    </div>

                    <div className="wo-row">
                      <span className="wo-dot blue"></span>
                      <span className="label">In Progress</span>
                      <strong>83</strong>
                      <span>35%</span>
                    </div>

                    <div className="wo-row">
                      <span className="wo-dot orange"></span>
                      <span>Pending</span>
                      <strong>35</strong>
                      <span>15%</span>
                    </div>

                    <div className="wo-row">
                      <span className="wo-dot red"></span>
                      <span>Delayed</span>
                      <strong>12</strong>
                      <span>5%</span>
                    </div>
                  </div>
                </div>
              </CCardBody>
            </CCard>
          </CCol>
          {/* Leave Trend */}
         <CCol xl={4} lg={6} md={12}>
            <CCard className="dashboard-card chart-card">
              <CCardBody>
                <div className="card-header-shortcut">
                  <h6>Leave Trend (Last 6 Months)</h6>
                </div>

                <LeaveTrendChart />
              </CCardBody>
            </CCard>
          </CCol>

          {/* Payroll Trend */}
         <CCol xl={4} lg={6} md={12}>
            <CCard className="dashboard-card chart-card">
              <CCardBody>
                <div className="card-header-shortcut">
                  <h6>Payroll Processing Trend (Last 6 Months)</h6>
                </div>

                <PayrollTrendChart />
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>

        {/* SUMMARY CARDS + RECENT ACTIVITY  */}

        <CRow className="g-3 ">
          {/* Salary & Payroll Summary */}
         <CCol xl={4} lg={6} md={12}>
            <CCard className="dashboard-card summary-card">
              <CCardBody>
                <div className="summary-header">
                  <div className="summary-icon purple">
                    <CIcon icon={cilDollar} />
                  </div>

                  <div>
                    <h5 className="summary-title">Salary & Payroll Summary</h5>
                    <small className="text-medium-emphasis">Payroll Overview - May 2025</small>
                  </div>
                </div>
                <div className="summary-list">
                  <div className="summary-row">
                    <span>Total Salary Processed</span>
                    <strong>₹ 3.85 Cr</strong>
                  </div>

                  <div className="summary-row">
                    <span>Pending Salary Registers</span>
                    <strong>6</strong>
                  </div>

                  <div className="summary-row">
                    <span>Active Salary Structures</span>
                    <strong>24</strong>
                  </div>

                  <div className="summary-row">
                    <span>Salary Components</span>
                    <strong>56</strong>
                  </div>
                </div>
              </CCardBody>
            </CCard>
          </CCol>
         <CCol xl={4} lg={6} md={12}>
            <CCard className="dashboard-card summary-card">
              <CCardBody>
                <div className="summary-header">
                  <div className="summary-icon green">
                    <CIcon icon={cilBuilding} />
                  </div>

                  <div>
                    <h5 className="summary-title">Resource & Vendor Management</h5>
                    <small className="text-medium-emphasis">Current Status</small>
                  </div>
                </div>

                <div className="summary-list">
                  <div className="summary-row">
                    <span>Resource Rates Updated</span>
                    <strong>15</strong>
                  </div>

                  <div className="summary-row">
                    <span>Active Vendors</span>
                    <strong>156</strong>
                  </div>

                  <div className="summary-row">
                    <span>New Empanelments (This Month)</span>
                    <strong>9</strong>
                  </div>

                  <div className="summary-row">
                    <span>Vendor Categories</span>
                    <strong>12</strong>
                  </div>
                </div>
              </CCardBody>
            </CCard>
          </CCol>

          {/* Recent Activities */}
        <CCol xl={4} lg={6} md={12}>
            <CCard className="dashboard-card activity-card">
              <CCardBody>
                <div className="activity-header">
                  <h6>Recent Activities</h6>
                  <button className="view-all-btn">View All</button>
                </div>

                <div className="activity-list">
                  <div className="activity-row">
                    <div className="activity-icon green">
                      <CIcon icon={cilUserPlus} />
                    </div>

                    <div className="activity-content">
                      <h6>New Employee Added</h6>
                      <p>Rohit Verma has been added as Jr. Engineer</p>
                    </div>

                    <span className="activity-time">10:30 AM</span>
                  </div>

                  <div className="activity-row">
                    <div className="activity-icon blue">
                      <CIcon icon={cilBriefcase} />
                    </div>

                    <div className="activity-content">
                      <h6>Work Order Approved</h6>
                      <p>WO-1024 has been approved</p>
                    </div>

                    <span className="activity-time">09:45 AM</span>
                  </div>

                  <div className="activity-row">
                    <div className="activity-icon orange">
                      <CIcon icon={cilDescription} />
                    </div>

                    <div className="activity-content">
                      <h6>Leave Request Submitted</h6>
                      <p>3 leave requests submitted</p>
                    </div>

                    <span className="activity-time">09:15 AM</span>
                  </div>

                  <div className="activity-row">
                    <div className="activity-icon purple">
                      <CIcon icon={cilList} />
                    </div>

                    <div className="activity-content">
                      <h6>Salary Structure Updated</h6>
                      <p>Updated structure for Senior Engineer</p>
                    </div>

                    <span className="activity-time">Yesterday</span>
                  </div>

                  <div className="activity-row">
                    <div className="activity-icon teal">
                      <CIcon icon={cilBuilding} />
                    </div>

                    <div className="activity-content">
                      <h6>Vendor Added</h6>
                      <p>ABC Solutions empanelled as new vendor</p>
                    </div>

                    <span className="activity-time">Yesterday</span>
                  </div>
                </div>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CRow>

      <CRow className="g-3 mb-4 ">
        {/*System Shortcuts*/}
        <CCol lg={4}>
          <CCard className="dashboard-card">
            <CCardBody>
              <div className="card-header-shortcut">
                <h6>System Shortcuts</h6>
              </div>

              <div className="shortcut-grid">
                <button className="shortcut-btn">
                  <CIcon icon={cilUserPlus} />
                  <span>Add Employee</span>
                </button>

                <button className="shortcut-btn">
                  <CIcon icon={cilBriefcase} />
                  <span>New Work Order</span>
                </button>

                <button className="shortcut-btn">
                  <CIcon icon={cilDescription} />
                  <span>Leave Record</span>
                </button>

                <button className="shortcut-btn">
                  <CIcon icon={cilList} />
                  <span>Salary Register</span>
                </button>

                <button className="shortcut-btn">
                  <CIcon icon={cilBuilding} />
                  <span>Add Vendor</span>
                </button>

                <button className="shortcut-btn">
                  <CIcon icon={cilChartLine} />
                  <span>Resource Rate</span>
                </button>
              </div>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  )
}

export default Dashboard
