import pool from '../config/db.js';

// Execute a single query
export const executeQuery = async (query, params = []) => {
  try {
    const [results] = await pool.execute(query, params);
    return results;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
};

// Execute multiple queries in a transaction
export const executeTransaction = async (queries) => {
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();
    
    const results = [];
    for (const { query, params } of queries) {
      const [result] = await connection.execute(query, params);
      results.push(result);
    }
    
    await connection.commit();
    return results;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

// Find record by ID
export const findById = async (table, id, idColumn = 'id') => {
  const query = `SELECT * FROM ${table} WHERE ${idColumn} = ? LIMIT 1`;
  const results = await executeQuery(query, [id]);
  return results[0] || null;
};

// Find all records with optional conditions
export const findAll = async (table, conditions = {}, orderBy = null, limit = null, offset = null) => {
  let query = `SELECT * FROM ${table}`;
  const params = [];
  
  // Add WHERE conditions
  if (Object.keys(conditions).length > 0) {
    const whereClause = Object.keys(conditions)
      .map(key => `${key} = ?`)
      .join(' AND ');
    query += ` WHERE ${whereClause}`;
    params.push(...Object.values(conditions));
  }
  
  // Add ORDER BY
  if (orderBy) {
    query += ` ORDER BY ${orderBy}`;
  }
  
  // Add LIMIT and OFFSET
  if (limit) {
    query += ` LIMIT ?`;
    params.push(limit);
    
    if (offset) {
      query += ` OFFSET ?`;
      params.push(offset);
    }
  }
  
  return await executeQuery(query, params);
};

// Insert new record
export const insertRecord = async (table, data) => {
  const columns = Object.keys(data).join(', ');
  const placeholders = Object.keys(data).map(() => '?').join(', ');
  const values = Object.values(data);
  
  const query = `INSERT INTO ${table} (${columns}) VALUES (${placeholders})`;
  const result = await executeQuery(query, values);
  
  return {
    insertId: result.insertId,
    affectedRows: result.affectedRows
  };
};

// Update record by ID
export const updateRecord = async (table, id, data, idColumn = 'id') => {
  const setClause = Object.keys(data)
    .map(key => `${key} = ?`)
    .join(', ');
  const values = [...Object.values(data), id];
  
  const query = `UPDATE ${table} SET ${setClause} WHERE ${idColumn} = ?`;
  const result = await executeQuery(query, values);
  
  return {
    affectedRows: result.affectedRows,
    changedRows: result.changedRows
  };
};

// Delete record by ID
export const deleteRecord = async (table, id, idColumn = 'id') => {
  const query = `DELETE FROM ${table} WHERE ${idColumn} = ?`;
  const result = await executeQuery(query, [id]);
  
  return {
    affectedRows: result.affectedRows
  };
};

// Count records with optional conditions
export const countRecords = async (table, conditions = {}) => {
  let query = `SELECT COUNT(*) as total FROM ${table}`;
  const params = [];
  
  if (Object.keys(conditions).length > 0) {
    const whereClause = Object.keys(conditions)
      .map(key => `${key} = ?`)
      .join(' AND ');
    query += ` WHERE ${whereClause}`;
    params.push(...Object.values(conditions));
  }
  
  const result = await executeQuery(query, params);
  return result[0].total;
};