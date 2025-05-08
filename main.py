import streamlit as st
import pandas as pd
from datetime import datetime, timedelta
import uuid
import json
import os

# Set page configuration
st.set_page_config(
    page_title="Brooklyn Public Library System",
    page_icon="📚",
    layout="wide"
)

# Initialize session state variables if they don't exist
if 'books' not in st.session_state:
    st.session_state.books = pd.DataFrame({
        'id': ['B001', 'B002', 'B003', 'B004', 'B005'],
        'title': ['A Tree Grows in Brooklyn', 'Wives Like Us', 'Cannibalism: A Perfectly Natural History', 
                 'These Violent Delights', 'One Piece, Vol. 1'],
        'author': ['Betty Smith', 'Plum Sykes', 'Bill Schutt', 'Chloe Gong', 'Eiichiro Oda'],
        'genre': ['Fiction', 'Fiction', 'Non-Fiction', 'Fantasy', 'Manga'],
        'published_year': [1943, 2021, 2017, 2020, 1997],
        'status': ['Available', 'Checked Out', 'Available', 'Available', 'Checked Out'],
        'added_date': ['2023-01-15', '2023-02-20', '2023-03-10', '2023-04-05', '2023-05-12']
    })

if 'patrons' not in st.session_state:
    st.session_state.patrons = pd.DataFrame(columns=['id', 'name', 'email', 'phone', 'address', 'join_date', 'status'])

if 'loans' not in st.session_state:
    st.session_state.loans = pd.DataFrame(columns=['id', 'book_id', 'patron_id', 'checkout_date', 'due_date', 'return_date', 'status'])

# Define custom CSS
st.markdown("""
<style>
    .main {
        background-color: #f5f5f5;
    }
    .block-container {
        padding-top: 1rem;
        padding-bottom: 1rem;
    }
    h1, h2, h3 {
        color: #2C3E50;
    }
    .stButton button {
        background-color: #3498DB;
        color: white;
        border-radius: 5px;
        padding: 0.5rem 1rem;
        border: none;
    }
    .stButton button:hover {
        background-color: #2980B9;
    }
    .st-bx {
        border-radius: 5px;
    }
    .css-1d391kg {
        padding: 1rem;
    }
    .card {
        background-color: white;
        border-radius: 5px;
        padding: 20px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        margin-bottom: 20px;
    }
</style>
""", unsafe_allow_html=True)

# Create a navigation sidebar
def sidebar_navigation():
    with st.sidebar:
        st.image("https://via.placeholder.com/150x100?text=Library+Logo", width=150)
        st.title("Brooklyn Public Library")
        
        page = st.radio("Navigation", 
                        ["Dashboard", "Book Management", "Patron Management", 
                         "Circulation", "Reports", "Settings"])
        
        st.markdown("---")
        st.markdown("© 2025 Brooklyn Public Library")
        
    return page

# Dashboard page
def dashboard():
    st.title("📚 Library Management System")
    st.subheader("Dashboard")
    
    # Display some stats
    col1, col2, col3 = st.columns(3)
    
    with col1:
        st.markdown("""
        <div class="card">
            <h3>Total Books</h3>
            <h2>{}</h2>
        </div>
        """.format(len(st.session_state.books)), unsafe_allow_html=True)
        
    with col2:
        st.markdown("""
        <div class="card">
            <h3>Total Patrons</h3>
            <h2>{}</h2>
        </div>
        """.format(len(st.session_state.patrons)), unsafe_allow_html=True)
        
    with col3:
        active_loans = len(st.session_state.loans[st.session_state.loans['status'] == 'Active'])
        st.markdown("""
        <div class="card">
            <h3>Active Loans</h3>
            <h2>{}</h2>
        </div>
        """.format(active_loans), unsafe_allow_html=True)
    
    # Books by status
    st.subheader("Books by Status")
    status_counts = st.session_state.books['status'].value_counts().reset_index()
    status_counts.columns = ['Status', 'Count']
    st.bar_chart(status_counts.set_index('Status'))
    
    # Recent activities
    st.subheader("Recent Activities")
    if not st.session_state.loans.empty:
        recent_loans = st.session_state.loans.sort_values('checkout_date', ascending=False).head(5)
        for _, loan in recent_loans.iterrows():
            book_info = st.session_state.books[st.session_state.books['id'] == loan['book_id']].iloc[0]
            patron_info = st.session_state.patrons[st.session_state.patrons['id'] == loan['patron_id']].iloc[0]
            
            activity_text = f"{patron_info['name']} checked out '{book_info['title']}' on {loan['checkout_date']}"
            st.info(activity_text)
    else:
        st.info("No recent activities")

# Book Management page
def book_management():
    st.title("📚 Book Management")
    
    tab1, tab2, tab3 = st.tabs(["Books Catalog", "Add New Book", "Edit Book"])
    
    with tab1:
        st.subheader("Books Catalog")
        
        # Search and filter
        col1, col2 = st.columns([3, 1])
        with col1:
            search_term = st.text_input("Search books by title or author")
        with col2:
            status_filter = st.selectbox("Filter by status", ["All", "Available", "Checked Out"])
        
        filtered_books = st.session_state.books.copy()
        
        if search_term:
            filtered_books = filtered_books[
                filtered_books['title'].str.contains(search_term, case=False) | 
                filtered_books['author'].str.contains(search_term, case=False)
            ]
        
        if status_filter != "All":
            filtered_books = filtered_books[filtered_books['status'] == status_filter]
        
        st.dataframe(filtered_books, use_container_width=True)
        
        if st.button("Export to CSV"):
            filtered_books.to_csv("books_catalog.csv", index=False)
            st.success("Books catalog exported to CSV!")
    
    with tab2:
        st.subheader("Add New Book")
        
        with st.form("add_book_form"):
            new_book_id = f"B{str(len(st.session_state.books) + 1).zfill(3)}"
            st.text_input("Book ID", new_book_id, disabled=True)
            new_title = st.text_input("Title", key="new_title")
            new_author = st.text_input("Author", key="new_author")
            new_genre = st.selectbox("Genre", ["Fiction", "Non-Fiction", "Fantasy", "Sci-Fi", "Mystery", 
                                              "Biography", "History", "Self-Help", "Children", "Manga"])
            new_year = st.number_input("Published Year", min_value=1000, max_value=datetime.now().year, 
                                        value=datetime.now().year)
            new_status = st.selectbox("Status", ["Available", "Checked Out", "Processing", "Lost"])
            
            submit_button = st.form_submit_button("Add Book")
            
            if submit_button:
                if new_title and new_author:
                    new_book = {
                        'id': new_book_id,
                        'title': new_title,
                        'author': new_author,
                        'genre': new_genre,
                        'published_year': new_year,
                        'status': new_status,
                        'added_date': datetime.now().strftime('%Y-%m-%d')
                    }
                    
                    st.session_state.books = pd.concat([st.session_state.books, 
                                                       pd.DataFrame([new_book])], ignore_index=True)
                    st.success(f"Book '{new_title}' added successfully!")
                else:
                    st.error("Title and Author are required fields.")
    
    with tab3:
        st.subheader("Edit Book")
        
        book_to_edit = st.selectbox("Select a book to edit", 
                                  st.session_state.books['title'].tolist(), 
                                  key="book_to_edit")
        
        if book_to_edit:
            book_index = st.session_state.books[st.session_state.books['title'] == book_to_edit].index[0]
            book_data = st.session_state.books.iloc[book_index]
            
            with st.form("edit_book_form"):
                st.text_input("Book ID", book_data['id'], disabled=True, key="edit_id")
                edit_title = st.text_input("Title", book_data['title'], key="edit_title")
                edit_author = st.text_input("Author", book_data['author'], key="edit_author")
                edit_genre = st.selectbox("Genre", ["Fiction", "Non-Fiction", "Fantasy", "Sci-Fi", "Mystery", 
                                                 "Biography", "History", "Self-Help", "Children", "Manga"], 
                                       index=["Fiction", "Non-Fiction", "Fantasy", "Sci-Fi", "Mystery",
                                              "Biography", "History", "Self-Help", "Children", "Manga"].index(book_data['genre']))
                edit_year = st.number_input("Published Year", min_value=1000, max_value=datetime.now().year, 
                                          value=book_data['published_year'])
                edit_status = st.selectbox("Status", ["Available", "Checked Out", "Processing", "Lost"], 
                                        index=["Available", "Checked Out", "Processing", "Lost"].index(book_data['status']))
                
                update_button = st.form_submit_button("Update Book")
                
                if update_button:
                    if edit_title and edit_author:
                        st.session_state.books.at[book_index, 'title'] = edit_title
                        st.session_state.books.at[book_index, 'author'] = edit_author
                        st.session_state.books.at[book_index, 'genre'] = edit_genre
                        st.session_state.books.at[book_index, 'published_year'] = edit_year
                        st.session_state.books.at[book_index, 'status'] = edit_status
                        
                        st.success(f"Book '{edit_title}' updated successfully!")
                    else:
                        st.error("Title and Author are required fields.")

# Patron Management page
def patron_management():
    st.title("👥 Patron Management")
    
    tab1, tab2, tab3 = st.tabs(["Patrons Directory", "Register New Patron", "Edit Patron"])
    
    with tab1:
        st.subheader("Patrons Directory")
        
        # Search functionality
        search_patron = st.text_input("Search patrons by name or email")
        
        filtered_patrons = st.session_state.patrons.copy()
        
        if search_patron:
            filtered_patrons = filtered_patrons[
                filtered_patrons['name'].str.contains(search_patron, case=False) | 
                filtered_patrons['email'].str.contains(search_patron, case=False)
            ]
        
        st.dataframe(filtered_patrons, use_container_width=True)
        
        if st.button("View Patron's Loans", key="view_loans"):
            patron_name = st.selectbox("Select a patron", filtered_patrons['name'].tolist())
            if patron_name:
                patron_id = filtered_patrons[filtered_patrons['name'] == patron_name]['id'].iloc[0]
                patron_loans = st.session_state.loans[st.session_state.loans['patron_id'] == patron_id]
                
                if not patron_loans.empty:
                    st.subheader(f"Loans for {patron_name}")
                    
                    loan_details = []
                    for _, loan in patron_loans.iterrows():
                        book_info = st.session_state.books[st.session_state.books['id'] == loan['book_id']].iloc[0]
                        loan_details.append({
                            'Book Title': book_info['title'],
                            'Checkout Date': loan['checkout_date'],
                            'Due Date': loan['due_date'],
                            'Status': loan['status']
                        })
                    
                    st.table(pd.DataFrame(loan_details))
                else:
                    st.info(f"{patron_name} has no active loans.")
    
    with tab2:
        st.subheader("Register New Patron")
        
        with st.form("add_patron_form"):
            new_patron_id = f"P{str(len(st.session_state.patrons) + 1).zfill(3)}"
            st.text_input("Patron ID", new_patron_id, disabled=True)
            new_name = st.text_input("Full Name")
            new_email = st.text_input("Email Address")
            new_phone = st.text_input("Phone Number")
            new_address = st.text_area("Address")
            
            submit_button = st.form_submit_button("Register Patron")
            
            if submit_button:
                if new_name and new_email:
                    new_patron = {
                        'id': new_patron_id,
                        'name': new_name,
                        'email': new_email,
                        'phone': new_phone,
                        'address': new_address,
                        'join_date': datetime.now().strftime('%Y-%m-%d'),
                        'status': 'Active'
                    }
                    
                    st.session_state.patrons = pd.concat([st.session_state.patrons, 
                                                         pd.DataFrame([new_patron])], ignore_index=True)
                    st.success(f"Patron '{new_name}' registered successfully!")
                else:
                    st.error("Name and Email are required fields.")
    
    with tab3:
        st.subheader("Edit Patron")
        
        patron_to_edit = st.selectbox("Select a patron to edit", 
                                    st.session_state.patrons['name'].tolist())
        
        if patron_to_edit:
            patron_index = st.session_state.patrons[st.session_state.patrons['name'] == patron_to_edit].index[0]
            patron_data = st.session_state.patrons.iloc[patron_index]
            
            with st.form("edit_patron_form"):
                st.text_input("Patron ID", patron_data['id'], disabled=True)
                edit_name = st.text_input("Full Name", patron_data['name'])
                edit_email = st.text_input("Email Address", patron_data['email'])
                edit_phone = st.text_input("Phone Number", patron_data['phone'])
                edit_status = st.selectbox("Status", ["Active", "Inactive"], 
                                        index=["Active", "Inactive"].index(patron_data['status']))
                
                update_button = st.form_submit_button("Update Patron")
                
                if update_button:
                    if edit_name and edit_email:
                        st.session_state.patrons.at[patron_index, 'name'] = edit_name
                        st.session_state.patrons.at[patron_index, 'email'] = edit_email
                        st.session_state.patrons.at[patron_index, 'phone'] = edit_phone
                        st.session_state.patrons.at[patron_index, 'status'] = edit_status
                        
                        st.success(f"Patron '{edit_name}' updated successfully!")
                    else:
                        st.error("Name and Email are required fields.")

# Circulation page
def circulation():
    st.title("🔄 Circulation")
    
    tab1, tab2, tab3 = st.tabs(["Check Out", "Check In", "Active Loans"])
    
    with tab1:
        st.subheader("Check Out Books")
        
        # Select patron
        patron_name = st.selectbox("Select Patron", 
                                 st.session_state.patrons[st.session_state.patrons['status'] == 'Active']['name'].tolist(),
                                 key="checkout_patron")
        
        if patron_name:
            patron_id = st.session_state.patrons[st.session_state.patrons['name'] == patron_name]['id'].iloc[0]
            
            # Select book
            available_books = st.session_state.books[st.session_state.books['status'] == 'Available']
            book_title = st.selectbox("Select Book", 
                                    available_books['title'].tolist(),
                                    key="checkout_book")
            
            if book_title:
                book_id = available_books[available_books['title'] == book_title]['id'].iloc[0]
                
                # Set due date
                checkout_date = datetime.now().date()
                due_date = checkout_date + timedelta(days=14)  # Default loan period: 14 days
                
                custom_due_date = st.date_input("Due Date", due_date)
                
                if st.button("Check Out Book"):
                    # Create new loan
                    new_loan_id = f"L{str(len(st.session_state.loans) + 1).zfill(3)}"
                    new_loan = {
                        'id': new_loan_id,
                        'book_id': book_id,
                        'patron_id': patron_id,
                        'checkout_date': checkout_date.strftime('%Y-%m-%d'),
                        'due_date': custom_due_date.strftime('%Y-%m-%d'),
                        'return_date': None,
                        'status': 'Active'
                    }
                    
                    # Add to loans DataFrame
                    st.session_state.loans = pd.concat([st.session_state.loans, 
                                                      pd.DataFrame([new_loan])], ignore_index=True)
                    
                    # Update book status
                    book_index = st.session_state.books[st.session_state.books['id'] == book_id].index[0]
                    st.session_state.books.at[book_index, 'status'] = 'Checked Out'
                    
                    st.success(f"Book '{book_title}' checked out to {patron_name} successfully!")
    
    with tab2:
        st.subheader("Check In Books")
        
        # Only show active loans
        active_loans = st.session_state.loans[st.session_state.loans['status'] == 'Active']
        
        if not active_loans.empty:
            loan_options = []
            for _, loan in active_loans.iterrows():
                book_title = st.session_state.books[st.session_state.books['id'] == loan['book_id']]['title'].iloc[0]
                patron_name = st.session_state.patrons[st.session_state.patrons['id'] == loan['patron_id']]['name'].iloc[0]
                loan_options.append(f"{book_title} (checked out by {patron_name})")
            
            selected_loan = st.selectbox("Select a book to return", loan_options)
            
            if selected_loan:
                # Parse book title and patron
                selected_book_title = selected_loan.split(" (checked out by ")[0]
                book_id = st.session_state.books[st.session_state.books['title'] == selected_book_title]['id'].iloc[0]
                
                # Find the loan
                loan_index = active_loans[active_loans['book_id'] == book_id].index[0]
                loan_data = active_loans.iloc[loan_index]
                
                # Display loan details
                col1, col2 = st.columns(2)
                with col1:
                    st.write(f"**Checkout Date:** {loan_data['checkout_date']}")
                    st.write(f"**Due Date:** {loan_data['due_date']}")
                
                with col2:
                    due_date = datetime.strptime(loan_data['due_date'], '%Y-%m-%d').date()
                    today = datetime.now().date()
                    
                    if today > due_date:
                        st.error(f"**Overdue by {(today - due_date).days} days**")
                        st.write(f"**Late Fee:** ${(today - due_date).days * 0.25:.2f}")
                    else:
                        st.success("**Book is returned on time**")
                
                if st.button("Check In Book"):
                    # Update loan status
                    st.session_state.loans.at[loan_index, 'status'] = 'Returned'
                    st.session_state.loans.at[loan_index, 'return_date'] = today.strftime('%Y-%m-%d')
                    
                    # Update book status
                    book_index = st.session_state.books[st.session_state.books['id'] == book_id].index[0]
                    st.session_state.books.at[book_index, 'status'] = 'Available'
                    
                    st.success(f"Book '{selected_book_title}' has been checked in successfully!")
        else:
            st.info("No active loans to check in.")
    
    with tab3:
        st.subheader("Active Loans")
        
        active_loans = st.session_state.loans[st.session_state.loans['status'] == 'Active']
        
        if not active_loans.empty:
            loan_details = []
            for _, loan in active_loans.iterrows():
                book_info = st.session_state.books[st.session_state.books['id'] == loan['book_id']].iloc[0]
                patron_info = st.session_state.patrons[st.session_state.patrons['id'] == loan['patron_id']].iloc[0]
                
                due_date = datetime.strptime(loan['due_date'], '%Y-%m-%d').date()
                today = datetime.now().date()
                status = "Overdue" if today > due_date else "On Time"
                
                loan_details.append({
                    'Book Title': book_info['title'],
                    'Patron': patron_info['name'],
                    'Checkout Date': loan['checkout_date'],
                    'Due Date': loan['due_date'],
                    'Status': status
                })
            
            loans_df = pd.DataFrame(loan_details)
            st.dataframe(loans_df, use_container_width=True)
            
            # Filter for overdue books
            if st.checkbox("Show only overdue books"):
                overdue_loans = loans_df[loans_df['Status'] == 'Overdue']
                if not overdue_loans.empty:
                    st.subheader("Overdue Books")
                    st.dataframe(overdue_loans, use_container_width=True)
                else:
                    st.info("No overdue books.")
        else:
            st.info("No active loans.")

# Reports page
def reports():
    st.title("📊 Reports")
    
    report_type = st.selectbox("Select Report Type", 
                             ["Book Circulation Statistics", "Popular Books", 
                              "Overdue Books", "Patron Activity"])
    
    if report_type == "Book Circulation Statistics":
        st.subheader("Book Circulation Statistics")
        
        # Calculate statistics
        total_books = len(st.session_state.books)
        available_books = len(st.session_state.books[st.session_state.books['status'] == 'Available'])
        checked_out_books = len(st.session_state.books[st.session_state.books['status'] == 'Checked Out'])
        
        col1, col2, col3 = st.columns(3)
        with col1:
            st.metric("Total Books", total_books)
        with col2:
            st.metric("Available Books", available_books)
        with col3:
            st.metric("Checked Out Books", checked_out_books)
        
        # Books by genre
        st.subheader("Books by Genre")
        genre_counts = st.session_state.books['genre'].value_counts().reset_index()
        genre_counts.columns = ['Genre', 'Count']
        st.bar_chart(genre_counts.set_index('Genre'))
        
    elif report_type == "Popular Books":
        st.subheader("Popular Books")
        
        # Count books by number of times they've been checked out
        if not st.session_state.loans.empty:
            book_counts = st.session_state.loans['book_id'].value_counts().reset_index()
            book_counts.columns = ['book_id', 'checkout_count']
            
            popular_books = []
            for _, row in book_counts.iterrows():
                book_info = st.session_state.books[st.session_state.books['id'] == row['book_id']].iloc[0]
                popular_books.append({
                    'Title': book_info['title'],
                    'Author': book_info['author'],
                    'Genre': book_info['genre'],
                    'Checkout Count': row['checkout_count']
                })
            
            popular_books_df = pd.DataFrame(popular_books).sort_values('Checkout Count', ascending=False)
            st.table(popular_books_df)
        else:
            st.info("No checkout data available.")
        
    elif report_type == "Overdue Books":
        st.subheader("Overdue Books")
        
        active_loans = st.session_state.loans[st.session_state.loans['status'] == 'Active']
        
        if not active_loans.empty:
            today = datetime.now().date()
            overdue_books = []
            
            for _, loan in active_loans.iterrows():
                due_date = datetime.strptime(loan['due_date'], '%Y-%m-%d').date()
                
                if today > due_date:
                    book_info = st.session_state.books[st.session_state.books['id'] == loan['book_id']].iloc[0]
                    patron_info = st.session_state.patrons[st.session_state.patrons['id'] == loan['patron_id']].iloc[0]
                    
                    days_overdue = (today - due_date).days
                    fine = days_overdue * 0.25  # $0.25 per day
                    
                    overdue_books.append({
                        'Title': book_info['title'],
                        'Patron': patron_info['name'],
                        'Due Date': loan['due_date'],
                        'Days Overdue': days_overdue,
                        'Fine': f"${fine:.2f}"
                    })
            
            if overdue_books:
                overdue_df = pd.DataFrame(overdue_books)
                st.dataframe(overdue_df, use_container_width=True)
                
                total_fines = sum([float(fine.replace('$', '')) for fine in overdue_df['Fine']])
                st.metric("Total Outstanding Fines", f"${total_fines:.2f}")
            else:
                st.success("No overdue books!")
        else:
            st.info("No active loans.")
        
    elif report_type == "Patron Activity":
        st.subheader("Patron Activity")
        
        if not st.session_state.loans.empty:
            patron_activity = st.session_state.loans['patron_id'].value_counts().reset_index()
            patron_activity.columns = ['patron_id', 'checkout_count']
            
            activity_data = []
            for _, row in patron_activity.iterrows():
                patron_info = st.session_state.patrons[st.session_state.patrons['id'] == row['patron_id']].iloc[0]
                activity_data.append({
                    'Patron': patron_info['name'],
                    'Books Checked Out': row['checkout_count'],
                    'Join Date': patron_info['join_date']
                })
            
            activity_df = pd.DataFrame(activity_data).sort_values('Books Checked Out', ascending=False)
            st.table(activity_df)
            
            # Most active patron
            if not activity_df.empty:
                most_active = activity_df.iloc[0]
                st.subheader("Most Active Patron")
                st.success(f"**{most_active['Patron']}** with {most_active['Books Checked Out']} checkouts")
        else:
            st.info("No checkout data available.")

# Settings page
def settings():
    st.title("⚙️ Settings")
    
    tab1, tab2 = st.tabs(["General Settings", "Backup & Restore"])
    
    with tab1:
        st.subheader("Library Information")
        
        library_name = st.text_input("Library Name", "Brooklyn Public Library")
        library_address = st.text_area("Library Address", "10 Grand Army Plaza, Brooklyn, NY 11238")
        
        col1, col2 = st.columns(2)

# Get selected page from the sidebar
page = sidebar_navigation()

# Render the corresponding page
if page == "Dashboard":
    dashboard()
elif page == "Book Management":
    book_management()
elif page == "Patron Management":
    patron_management()
elif page == "Circulation":
    circulation()
elif page == "Reports":
    reports()
elif page == "Settings":
    settings()