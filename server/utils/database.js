import getDatabase from '../config/db.js';

// Execute a single query
export const executeQuery = async (query, params = []) => {
  try {
    const db = await getDatabase();
    
    // Check if it's a SELECT query
    if (query.trim().toUpperCase().startsWith('SELECT')) {
      const results = await db.all(query, params);
      return results;
    } else {
      // INSERT, UPDATE, DELETE
      const result = await db.run(query, params);
      return result;
    }
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
};

// Execute multiple queries in a transaction
export const executeTransaction = async (queries) => {
  const db = await getDatabase();
  
  try {
    await db.exec('BEGIN TRANSACTION');
    
    const results = [];
    for (const { query, params } of queries) {
      let result;
      if (query.trim().toUpperCase().startsWith('SELECT')) {
        result = await db.all(query, params);
      } else {
        result = await db.run(query, params);
      }
      results.push(result);
    }
    
    await db.exec('COMMIT');
    return results;
  } catch (error) {
    await db.exec('ROLLBACK');
    throw error;
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
    insertId: result.lastID,
    affectedRows: result.changes
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
    affectedRows: result.changes,
    changedRows: result.changes
  };
};

// Delete record by ID
export const deleteRecord = async (table, id, idColumn = 'id') => {
  const query = `DELETE FROM ${table} WHERE ${idColumn} = ?`;
  const result = await executeQuery(query, [id]);
  
  return {
    affectedRows: result.changes
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