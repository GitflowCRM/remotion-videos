import React from 'react';

// SmallERP theme
const theme = {
  card: '#1e293b',
  border: '#334155',
  text: '#f8fafc',
  muted: '#94a3b8',
  dim: '#64748b',
  hover: 'rgba(99, 102, 241, 0.05)',
};

interface TableProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
}

export function Table({ children, style }: TableProps) {
  return (
    <div
      style={{
        width: '100%',
        overflow: 'hidden',
        borderRadius: 12,
        border: `1px solid ${theme.border}`,
        backgroundColor: theme.card,
        ...style,
      }}
    >
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        {children}
      </table>
    </div>
  );
}

export function TableHeader({ children }: { children: React.ReactNode }) {
  return (
    <thead>
      <tr
        style={{
          borderBottom: `1px solid ${theme.border}`,
          backgroundColor: 'rgba(0,0,0,0.2)',
        }}
      >
        {children}
      </tr>
    </thead>
  );
}

export function TableHead({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <th
      style={{
        padding: '12px 16px',
        textAlign: 'left',
        fontSize: 12,
        fontWeight: 600,
        color: theme.muted,
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        ...style,
      }}
    >
      {children}
    </th>
  );
}

export function TableBody({ children }: { children: React.ReactNode }) {
  return <tbody>{children}</tbody>;
}

export function TableRow({ 
  children, 
  style 
}: { 
  children: React.ReactNode; 
  style?: React.CSSProperties;
}) {
  return (
    <tr
      style={{
        borderBottom: `1px solid ${theme.border}`,
        ...style,
      }}
    >
      {children}
    </tr>
  );
}

export function TableCell({ 
  children, 
  style 
}: { 
  children: React.ReactNode; 
  style?: React.CSSProperties;
}) {
  return (
    <td
      style={{
        padding: '14px 16px',
        fontSize: 14,
        color: theme.text,
        ...style,
      }}
    >
      {children}
    </td>
  );
}

// Simple data table component
interface DataTableProps<T> {
  data: T[];
  columns: {
    key: keyof T | string;
    header: string;
    render?: (item: T) => React.ReactNode;
    style?: React.CSSProperties;
  }[];
  rowDelay?: number;
  currentFrame?: number;
}

export function DataTable<T extends Record<string, any>>({ 
  data, 
  columns,
  rowDelay = 15,
  currentFrame = 999,
}: DataTableProps<T>) {
  return (
    <Table>
      <TableHeader>
        {columns.map((col, i) => (
          <TableHead key={i} style={col.style}>
            {col.header}
          </TableHead>
        ))}
      </TableHeader>
      <TableBody>
        {data.map((item, rowIndex) => {
          const delay = rowIndex * rowDelay;
          const opacity = currentFrame >= delay ? 1 : 0;
          const transform = currentFrame >= delay 
            ? 'translateX(0)' 
            : 'translateX(20px)';
          
          return (
            <TableRow 
              key={rowIndex}
              style={{
                opacity,
                transform,
                transition: 'all 300ms ease',
              }}
            >
              {columns.map((col, colIndex) => (
                <TableCell key={colIndex} style={col.style}>
                  {col.render 
                    ? col.render(item) 
                    : String(item[col.key as keyof T] || '')}
                </TableCell>
              ))}
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
