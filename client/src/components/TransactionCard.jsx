import dayjs from 'dayjs';

export default function TransactionCard({ txn }) {
  const statusColor =
    txn.status === 'success'
      ? '#22c55e'
      : txn.status === 'pending'
      ? '#f59e0b'
      : '#ef4444';

  return (
    <div
      style={{
        backgroundColor: '#f9fafb',
        padding: '15px',
        borderRadius: '6px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <div>
        <p style={{ margin: 0 }}>
          <strong>Receiver:</strong> {txn.receiver}
        </p>
        <p style={{ margin: 0 }}>
          <strong>Method:</strong> {txn.method || '-'}
        </p>
        <p style={{ margin: 0, fontSize: '12px', color: '#6b7280' }}>
          {txn.createdAt ? dayjs(txn.createdAt).format('DD MMM YYYY, hh:mm A') : ''}
        </p>
      </div>

      <div style={{ textAlign: 'right' }}>
        <p
          style={{
            margin: 0,
            fontWeight: 'bold',
            color: '#4f46e5',
            fontSize: '18px',
          }}
        >
          ₹{txn.amount}
        </p>
        <p
          style={{
            margin: 0,
            color: statusColor,
            fontWeight: 'bold',
            textTransform: 'uppercase',
            fontSize: '12px',
          }}
        >
          {txn.status}
        </p>
      </div>
    </div>
  );
}
