import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminPortal = () => {
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [categories, setCategories] = useState(['Electronics', 'Sports', 'Health', 'Fashion']);
    
    const [isAddingNewCategory, setIsAddingNewCategory] = useState(false);
    const [newCatName, setNewCatName] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    const [newProduct, setNewProduct] = useState({ 
        name: '', 
        description: '',
        basePrice: '',   
        currentPrice: '', 
        stock: 10, 
        category: 'Electronics'
    });

    useEffect(() => { fetchAdminData(); }, []);

    const fetchAdminData = async () => {
        try {
            const prodRes = await axios.get('http://localhost:8080/api/products');
            const orderRes = await axios.get('http://localhost:8080/api/admin/orders');
            setProducts(prodRes.data);
            setOrders(orderRes.data);
        } catch (err) { console.error("Error fetching data", err); }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setImagePreview(URL.createObjectURL(file)); 
        }
    };

    const handleAddProduct = async (e) => {
        e.preventDefault();
        const finalCategory = isAddingNewCategory ? newCatName : newProduct.category;
        const formData = new FormData();
        const productBlob = new Blob([JSON.stringify({
            ...newProduct,
            category: finalCategory,
            basePrice: parseFloat(newProduct.basePrice),
            currentPrice: parseFloat(newProduct.currentPrice),
            stock: parseInt(newProduct.stock)
        })], { type: 'application/json' });

        formData.append('product', productBlob);
        formData.append('file', selectedFile);

        try {
            await axios.post('http://localhost:8080/api/admin/products', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            alert("Success: Product Catalog Updated!");
            setNewProduct({ name: '', description: '', basePrice: '', currentPrice: '', stock: 10, category: 'Electronics' });
            setSelectedFile(null); setImagePreview(null);
            if (isAddingNewCategory) setCategories([...categories, newCatName]);
            setIsAddingNewCategory(false);
            fetchAdminData();
        } catch (err) { alert("Error uploading product."); }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Confirm deletion? This action cannot be undone.")) {
            try {
                await axios.delete(`http://localhost:8080/api/admin/products/${id}`);
                setProducts(products.filter(p => p.id !== id));
            } catch (err) { alert("Error deleting product"); }
        }
    };

    return (
        <div style={styles.dashboardWrapper}>
            <header style={styles.header}>
                <h1 style={styles.pageTitle}>Admin Command Center</h1>
                <p style={styles.subtitle}>Manage your inventory and live customer orders</p>
            </header>

            <div style={styles.gridContainer}>
                {/* ADD PRODUCT FORM CARD */}
                <section style={styles.card}>
                    <h3 style={styles.cardTitle}>Inventory Management</h3>
                    <form onSubmit={handleAddProduct} style={styles.form}>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Product Identity</label>
                            <input type="text" placeholder="e.g., Wireless Headphones" style={styles.input}
                                   value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} required />
                        </div>
                        
                        <textarea placeholder="Write a short marketing description..." style={{...styles.input, minHeight: '80px', resize: 'vertical'}}
                                  value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} />

                        <div style={styles.row}>
                            <div style={{flex: 1}}>
                                <label style={styles.label}>Market Price ($)</label>
                                <input type="number" placeholder="0.00" style={styles.input} value={newProduct.basePrice}
                                       onChange={e => setNewProduct({...newProduct, basePrice: e.target.value})} required />
                            </div>
                            <div style={{flex: 1}}>
                                <label style={styles.label}>Sale Price ($)</label>
                                <input type="number" placeholder="0.00" style={styles.input} value={newProduct.currentPrice}
                                       onChange={e => setNewProduct({...newProduct, currentPrice: e.target.value})} required />
                            </div>
                        </div>

                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Classification</label>
                            <div style={{display: 'flex', gap: '8px'}}>
                                {!isAddingNewCategory ? (
                                    <select style={styles.select} value={newProduct.category} 
                                            onChange={e => setNewProduct({...newProduct, category: e.target.value})}>
                                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                ) : (
                                    <input type="text" placeholder="New category name" style={styles.input}
                                           onChange={e => setNewCatName(e.target.value)} required />
                                )}
                                <button type="button" style={styles.outlineBtn} onClick={() => setIsAddingNewCategory(!isAddingNewCategory)}>
                                    {isAddingNewCategory ? '✖' : '＋'}
                                </button>
                            </div>
                        </div>

                        <div style={styles.uploadBox}>
                            <label style={styles.fileLabel}>
                                📷 {selectedFile ? 'Image Ready' : 'Choose Product Photo'}
                                <input type="file" accept="image/*" style={{display: 'none'}} onChange={handleFileChange} required />
                            </label>
                            {imagePreview && <img src={imagePreview} alt="Preview" style={styles.previewImg} />}
                        </div>

                        <button type="submit" style={styles.primaryBtn}>Save Product to Catalog</button>
                    </form>
                </section>

                {/* ORDERS FEED CARD */}
                <section style={{...styles.card, background: '#1e293b'}}>
                    <h3 style={{...styles.cardTitle, color: '#f8fafc'}}>Live Orders Queue</h3>
                    <div style={styles.orderList}>
                        {orders.length === 0 ? <p style={{color: '#94a3b8'}}>No active orders found.</p> : orders.map(order => (
                            <div key={order.id} style={styles.orderItem}>
                                <div>
                                    <div style={{fontWeight: 'bold', color: '#f8fafc'}}>Order #{order.id}</div>
                                    <div style={{fontSize: '12px', color: '#94a3b8'}}>Live Transaction</div>
                                </div>
                                <div style={styles.priceTag}>${order.totalAmount}</div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>

            {/* INVENTORY TABLE CARD */}
            <div style={{...styles.card, marginTop: '30px', padding: '0'}}>
                <div style={{padding: '20px 25px', borderBottom: '1px solid #e2e8f0'}}>
                    <h3 style={{...styles.cardTitle, margin: 0}}>Catalog Overview</h3>
                </div>
                <table style={styles.table}>
                    <thead>
                        <tr style={styles.tableHead}>
                            <th style={styles.th}>Product Name</th>
                            <th style={styles.th}>MSRP</th>
                            <th style={styles.th}>Sale Price</th>
                            <th style={styles.th}>Availability</th>
                            <th style={styles.th}>Category</th>
                            <th style={styles.th}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(p => (
                            <tr key={p.id} style={styles.tr}>
                                <td style={{...styles.td, fontWeight: '600', color: '#1e293b'}}>{p.name}</td>
                                <td style={{...styles.td, color: '#94a3b8', textDecoration: 'line-through'}}>${p.basePrice}</td>
                                <td style={{...styles.td, color: '#10b981', fontWeight: 'bold'}}>${p.price || p.currentPrice}</td>
                                <td style={styles.td}>
                                    <span style={{
                                        ...styles.stockIndicator, 
                                        color: p.stock < 5 ? '#ef4444' : '#64748b'
                                    }}>
                                        {p.stock} units
                                    </span>
                                </td>
                                <td style={styles.td}>
                                    <span style={styles.categoryPill}>{p.category}</span>
                                </td>
                                <td style={styles.td}>
                                    <button onClick={() => handleDelete(p.id)} style={styles.deleteBtn}>Remove</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

/* ---------------- MODERN UI STYLING ---------------- */


const styles = {
    dashboardWrapper: {
        padding: '40px',
        backgroundColor: '#f8fafc',
        minHeight: '100vh',
        fontFamily: '"Inter", -apple-system, sans-serif'
    },
    header: { marginBottom: '30px' },
    pageTitle: { fontSize: '28px', color: '#1e293b', margin: '0 0 8px 0', letterSpacing: '-0.5px' },
    subtitle: { color: '#64748b', fontSize: '15px' },
    gridContainer: { display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '30px' },
    card: {
        backgroundColor: '#fff',
        borderRadius: '16px',
        padding: '30px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        border: '1px solid #e2e8f0'
    },
    cardTitle: { fontSize: '18px', color: '#1e293b', marginBottom: '20px', fontWeight: '700' },
    form: { display: 'flex', flexDirection: 'column', gap: '16px' },
    label: { fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', marginBottom: '4px', display: 'block' },
    input: {
        padding: '12px 16px',
        borderRadius: '8px',
        border: '1px solid #e2e8f0',
        fontSize: '14px',
        width: '100%',
        boxSizing: 'border-box',
        outline: 'none',
        transition: 'border-color 0.2s'
    },
    select: {
        flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', backgroundColor: '#fff'
    },
    row: { display: 'flex', gap: '16px' },
    uploadBox: {
        border: '2px dashed #e2e8f0',
        borderRadius: '12px',
        padding: '20px',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '12px'
    },
    fileLabel: { color: '#3b82f6', fontWeight: '600', cursor: 'pointer', fontSize: '14px' },
    previewImg: { width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px' },
    primaryBtn: {
        backgroundColor: '#000000ff',
        color: '#fff',
        border: 'none',
        padding: '14px',
        borderRadius: '8px',
        fontWeight: '700',
        cursor: 'pointer',
        fontSize: '15px',
        transition: 'background 0.2s'
    },
    outlineBtn: {
        padding: '0 15px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer'
    },
    orderList: { display: 'flex', flexDirection: 'column', gap: '12px' },
    orderItem: {
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '16px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)'
    },
    priceTag: { background: '#10b981', padding: '4px 10px', borderRadius: '6px', fontWeight: 'bold', fontSize: '14px' },
    table: { width: '100%', borderCollapse: 'collapse' },
    th: { textAlign: 'left', padding: '16px 25px', backgroundColor: '#f8fafc', color: '#64748b', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase' },
    tr: { borderBottom: '1px solid #f1f5f9' },
    td: { padding: '16px 25px', fontSize: '14px', color: '#475569' },
    categoryPill: { background: '#f1f5f9', padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '700', color: '#64748b' },
    stockIndicator: { fontSize: '13px', fontWeight: '600' },
    deleteBtn: { background: '#fee2e2', color: '#ef4444', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }
};

export default AdminPortal;