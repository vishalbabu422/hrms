const Payslip = ({ data, mode = 'view', onGenerate }) => {
  const cell = {
    border: '1px solid #000',
    padding: '6px',
  }

  if (!data) return null

  return (
    <div style={{ padding: '20px', background: '#fff' }}>
      
      {/* DATE */}
      <div style={{ textAlign: 'right' }}>
        <strong>Date:</strong> {new Date().toLocaleDateString()}
      </div>

      <br />

      {/* DETAILS */}
      <p><strong>Employee:</strong> {data.employee_name}</p>
      <p><strong>Transaction No:</strong> {data.transaction_no}</p>

      {/* TABLE */}
      <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #000' }}>
        <thead>
          <tr>
            <th colSpan="2" style={cell}>PAYSLIP DETAILS</th>
          </tr>
          <tr>
            <th style={cell}>Components</th>
            <th style={cell}>Monthly</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td style={cell}>Basic</td>
            <td style={cell}>₹ {Math.round(data.ctc * 0.5)}</td>
          </tr>
          <tr>
            <td style={cell}>HRA</td>
            <td style={cell}>₹ {Math.round(data.ctc * 0.25)}</td>
          </tr>
          <tr>
            <td style={cell}>Transport Allowance</td>
            <td style={cell}>₹ 1600</td>
          </tr>
          <tr>
            <td style={cell}>Professional Development Allowance</td>
            <td style={cell}>₹ {Math.round(data.ctc * 0.1)}</td>
          </tr>

          <tr>
            <td style={cell}><strong>Gross Earnings</strong></td>
            <td style={cell}><strong>₹ {data.gross_earnings}</strong></td>
          </tr>

          <tr>
            <td style={cell}><strong>Deductions</strong></td>
            <td style={cell}></td>
          </tr>

          <tr>
            <td style={cell}>Total Deductions</td>
            <td style={cell}>₹ {data.total_deductions}</td>
          </tr>

          <tr>
            <td style={cell}><strong>Net Pay</strong></td>
            <td style={cell}><strong>₹ {data.net_salary}</strong></td>
          </tr>
        </tbody>
      </table>

      <br />

      <p style={{ fontSize: '12px' }}>
        This is a system generated payslip.
      </p>

      {/* 🔥 CONTROLLED ACTION */}
      {mode === 'generate' && (
        <div style={{ textAlign: 'right', marginTop: '20px' }}>
          <button
            onClick={onGenerate}
            style={{
              background: '#3da375',
              color: '#fff',
              border: 'none',
              padding: '6px 15px',
              borderRadius: '4px',
            }}
          >
            Generate
          </button>
        </div>
      )}
    </div>
  )
}

export default Payslip