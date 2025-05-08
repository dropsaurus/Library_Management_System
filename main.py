import streamlit as st
import pandas as pd
from datetime import datetime, timedelta
import uuid
import json
import os
import plotly.express as px
import plotly.graph_objects as go
from streamlit_option_menu import option_menu
import base64
from PIL import Image
import io

# Set page configuration
st.set_page_config(
    page_title="Brooklyn Public Library System",
    page_icon="📚",
    layout="wide",
    initial_sidebar_state="expanded"
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
    st.session_state.patrons = pd.DataFrame({
        'id': ['P001', 'P002', 'P003'],
        'name': ['John Smith', 'Emma Wilson', 'Michael Chen'],
        'email': ['john@example.com', 'emma@example.com', 'michael@example.com'],
        'phone': ['555-123-4567', '555-987-6543', '555-456-7890'],
        'address': ['123 Main St, Brooklyn, NY', '456 Park Ave, Brooklyn, NY', '789 Ocean Blvd, Brooklyn, NY'],
        'join_date': ['2023-01-05', '2023-02-15', '2023-03-20'],
        'status': ['Active', 'Active', 'Active']
    })

if 'loans' not in st.session_state:
    # Create some sample loan data
    today = datetime.now().date()
    st.session_state.loans = pd.DataFrame({
        'id': ['L001', 'L002'],
        'book_id': ['B002', 'B005'],
        'patron_id': ['P001', 'P003'],
        'checkout_date': [(today - timedelta(days=10)).strftime('%Y-%m-%d'), 
                         (today - timedelta(days=5)).strftime('%Y-%m-%d')],
        'due_date': [(today + timedelta(days=4)).strftime('%Y-%m-%d'), 
                    (today + timedelta(days=9)).strftime('%Y-%m-%d')],
        'return_date': [None, None],
        'status': ['Active', 'Active']
    })

if 'events' not in st.session_state:
    today = datetime.now().date()
    st.session_state.events = pd.DataFrame({
        'id': ['E001', 'E002', 'E003'],
        'title': ['Book Reading: Local Authors', 'Children\'s Story Time', 'Literary Discussion Group'],
        'description': ['Join local Brooklyn authors for readings and book signings.', 
                       'Weekly story time for children ages 3-8.',
                       'Discussion of "To Kill a Mockingbird" by Harper Lee.'],
        'date': [(today + timedelta(days=3)).strftime('%Y-%m-%d'),
                (today + timedelta(days=7)).strftime('%Y-%m-%d'),
                (today + timedelta(days=14)).strftime('%Y-%m-%d')],
        'time': ['18:00 - 20:00', '10:00 - 11:00', '19:00 - 21:00'],
        'location': ['Main Hall', 'Children\'s Section', 'Study Room B'],
        'capacity': [50, 20, 15],
        'registered': [12, 8, 10]
    })

# Load or initialize library settings
if 'settings' not in st.session_state:
    st.session_state.settings = {
        'library_name': 'Brooklyn Public Library',
        'address': '10 Grand Army Plaza, Brooklyn, NY 11238',
        'phone': '(718) 230-2100',
        'email': 'info@bklynlibrary.org',
        'hours': 'Mon-Fri: 9:00 AM - 9:00 PM, Sat-Sun: 10:00 AM - 6:00 PM',
        'loan_period_days': 14,
        'max_loans_per_patron': 5,
        'overdue_fee_per_day': 0.25
    }

# Define custom CSS for a cleaner, more modern look
st.markdown("""
<style>
    /* Main background and fonts */
    .main {
        background-color: #f8f9fa;
        color: #333;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }
    
    /* Headers */
    h1, h2, h3, h4 {
        color: #0d6efd;
        font-weight: 600;
    }
    
    h1 {
        font-size: 2.5rem;
        border-bottom: 2px solid #0d6efd;
        padding-bottom: 0.5rem;
        margin-bottom: 1.5rem;
    }
    
    h2 {
        font-size: 1.8rem;
        margin-top: 1.5rem;
    }
    
    /* Cards and containers */
    .card {
        background-color: white;
        border-radius: 10px;
        box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        padding: 20px;
        margin-bottom: 20px;
        transition: transform 0.2s ease, box-shadow 0.2s ease;
    }
    
    .card:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 16px rgba(0,0,0,0.1);
    }
    
    .metric-card {
        text-align: center;
        padding: 15px;
    }
    
    .metric-value {
        font-size: 2.5rem;
        font-weight: 700;
        color: #0d6efd;
        margin: 10px 0;
    }
    
    .metric-label {
        font-size: 1rem;
        color: #6c757d;
    }
    
    /* Buttons and inputs */
    .stButton > button {
        background-color: #0d6efd;
        color: white;
        border-radius: 5px;
        padding: 0.5rem 1rem;
        border: none;
        transition: background-color 0.3s ease;
        font-weight: 500;
    }
    
    .stButton > button:hover {
        background-color: #0a58ca;
    }
    
    .secondary-button > button {
        background-color: #6c757d;
    }
    
    .secondary-button > button:hover {
        background-color: #5a6268;
    }
    
    .stTextInput > div > div > input, 
    .stSelectbox > div > div > div {
        border-radius: 5px;
    }
    
    /* Tables */
    .dataframe-container {
        border-radius: 10px;
        overflow: hidden;
        box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    }
    
    /* Custom elements */
    .activity-item {
        padding: 10px 15px;
        border-left: 3px solid #0d6efd;
        background-color: #f8f9fa;
        margin-bottom: 10px;
        border-radius: 0 5px 5px 0;
    }
    
    /* Status indicators */
    .status-available {
        color: #28a745;
        font-weight: 500;
    }
    
    .status-checked-out {
        color: #dc3545;
        font-weight: 500;
    }
    
    .status-processing {
        color: #fd7e14;
        font-weight: 500;
    }
    
    .status-overdue {
        color: #dc3545;
        font-weight: 700;
    }
    
    /* Sidebar */
    .css-1d391kg {
        background-color: #212529;
    }
    
    .css-12oz5g7 {
        max-width: 100%;
        padding: 2rem 1rem;
    }
    
    /* Hide the Streamlit footer and menu */
    #MainMenu {visibility: hidden;}
    footer {visibility: hidden;}
</style>
""", unsafe_allow_html=True)

# Sidebar navigation with improved styling and organization
def sidebar_navigation():
    with st.sidebar:
        # Library logo placeholder
        st.image("https://via.placeholder.com/150x100?text=BPL", width=150)
        
        # Library name and navigation title
        st.title(st.session_state.settings['library_name'])
        
        # Create a more modern navigation menu
        selected = option_menu(
            "Main Menu",
            ["Dashboard", "Books", "Patrons", "Circulation", "Events", "Reports", "Settings"],
            icons=["house", "book", "people", "arrow-left-right", "calendar", "bar-chart", "gear"],
            menu_icon="list",
            default_index=0,
            styles={
                "container": {"padding": "0!important", "background-color": "#212529"},
                "icon": {"color": "#0d6efd", "font-size": "20px"}, 
                "nav-link": {"font-size": "16px", "text-align": "left", "margin":"0px", "--hover-color": "#3a3f44"},
                "nav-link-selected": {"background-color": "#0d6efd"},
            }
        )
        
        # Library information in the sidebar footer
        st.markdown("---")
        st.caption(f"📞 {st.session_state.settings['phone']}")
        st.caption(f"📧 {st.session_state.settings['email']}")
        st.caption(f"🕒 {st.session_state.settings['hours']}")
        st.caption(f"© 2025 {st.session_state.settings['library_name']}")
        
    return selected

# Create a reusable card component
def create_card(title, value, icon, color="#0d6efd"):
    html = f"""
    <div class="card metric-card">
        <div style="font-size: 2rem; color: {color};">{icon}</div>
        <div class="metric-value" style="color: {color};">{value}</div>
        <div class="metric-label">{title}</div>
    </div>
    """
    return html

# Dashboard page with improved visualization and layout
def dashboard():
    st.title("📚 Library Dashboard")
    
    # Key metrics in modern cards with icons
    col1, col2, col3, col4 = st.columns(4)
    
    with col1:
        st.markdown(create_card(
            "Total Books", 
            len(st.session_state.books), 
            "📚", 
            "#0d6efd"
        ), unsafe_allow_html=True)
        
    with col2:
        st.markdown(create_card(
            "Total Patrons", 
            len(st.session_state.patrons), 
            "👥", 
            "#28a745"
        ), unsafe_allow_html=True)
        
    with col3:
        active_loans = len(st.session_state.loans[st.session_state.loans['status'] == 'Active'])
        st.markdown(create_card(
            "Active Loans", 
            active_loans, 
            "📖", 
            "#fd7e14"
        ), unsafe_allow_html=True)
        
    with col4:
        # Calculate overdue loans
        today = datetime.now().date()
        overdue_count = 0
        for _, loan in st.session_state.loans[st.session_state.loans['status'] == 'Active'].iterrows():
            due_date = datetime.strptime(loan['due_date'], '%Y-%m-%d').date()
            if today > due_date:
                overdue_count += 1
        
        st.markdown(create_card(
            "Overdue Books", 
            overdue_count, 
            "⏰", 
            "#dc3545"
        ), unsafe_allow_html=True)
    
    # Create two columns for the main dashboard content
    col1, col2 = st.columns([3, 2])
    
    with col1:
        # Books by status visualization
        st.markdown("<div class='card'>", unsafe_allow_html=True)
        st.subheader("Books by Status")
        
        status_counts = st.session_state.books['status'].value_counts().reset_index()
        status_counts.columns = ['Status', 'Count']
        
        colors = {
            'Available': '#28a745',
            'Checked Out': '#dc3545',
            'Processing': '#fd7e14',
            'Lost': '#6c757d'
        }
        
        fig = px.bar(
            status_counts, 
            x='Status', 
            y='Count',
            color='Status',
            color_discrete_map=colors,
            text='Count'
        )
        
        fig.update_layout(
            height=300,
            margin=dict(l=20, r=20, t=30, b=20),
            plot_bgcolor='white',
            paper_bgcolor='white',
            showlegend=False
        )
        
        fig.update_traces(textposition='outside')
        
        st.plotly_chart(fig, use_container_width=True)
        st.markdown("</div>", unsafe_allow_html=True)
        
        # Books by genre visualization
        st.markdown("<div class='card'>", unsafe_allow_html=True)
        st.subheader("Books by Genre")
        
        genre_counts = st.session_state.books['genre'].value_counts().reset_index()
        genre_counts.columns = ['Genre', 'Count']
        
        fig = px.pie(
            genre_counts, 
            names='Genre', 
            values='Count',
            hole=0.3,
            color_discrete_sequence=px.colors.qualitative.Pastel
        )
        
        fig.update_layout(
            height=300,
            margin=dict(l=20, r=20, t=30, b=20),
            paper_bgcolor='white'
        )
        
        st.plotly_chart(fig, use_container_width=True)
        st.markdown("</div>", unsafe_allow_html=True)
        
    with col2:
        # Upcoming events card
        st.markdown("<div class='card'>", unsafe_allow_html=True)
        st.subheader("Upcoming Events")
        
        today = datetime.now().date()
        upcoming_events = st.session_state.events[
            pd.to_datetime(st.session_state.events['date']) >= today
        ].sort_values('date').head(3)
        
        if not upcoming_events.empty:
            for _, event in upcoming_events.iterrows():
                event_date = datetime.strptime(event['date'], '%Y-%m-%d').date()
                days_until = (event_date - today).days
                
                st.markdown(f"""
                <div style="margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px solid #dee2e6;">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <div>
                            <h4 style="margin-bottom: 5px;">{event['title']}</h4>
                            <p style="margin-bottom: 5px; color: #6c757d;">
                                📍 {event['location']} | ⏰ {event['time']}
                            </p>
                        </div>
                        <div style="background-color: #e9ecef; padding: 8px; border-radius: 5px; text-align: center;">
                            <span style="font-weight: bold; display: block; font-size: 18px;">{days_until}</span>
                            <span style="font-size: 12px; color: #6c757d;">days</span>
                        </div>
                    </div>
                    <p style="margin-top: 10px;">{event['description'][:100]}...</p>
                </div>
                """, unsafe_allow_html=True)
        else:
            st.info("No upcoming events.")
        
        st.markdown("</div>", unsafe_allow_html=True)
        
        # Recent activities card
        st.markdown("<div class='card'>", unsafe_allow_html=True)
        st.subheader("Recent Activities")
        
        if not st.session_state.loans.empty:
            # Find the 5 most recent loans
            try:
                recent_loans = st.session_state.loans.sort_values('checkout_date', ascending=False).head(5)
                for _, loan in recent_loans.iterrows():
                    try:
                        book_info = st.session_state.books[st.session_state.books['id'] == loan['book_id']].iloc[0]
                        patron_info = st.session_state.patrons[st.session_state.patrons['id'] == loan['patron_id']].iloc[0]
                        
                        # Format activity text
                        if loan['status'] == 'Active':
                            activity_icon = "📤"
                            activity_text = f"{patron_info['name']} checked out <b>'{book_info['title']}'</b>"
                        else:
                            activity_icon = "📥"
                            activity_text = f"{patron_info['name']} returned <b>'{book_info['title']}'</b>"
                        
                        # Format date 
                        if loan['status'] == 'Active':
                            date_str = loan['checkout_date']
                        else:
                            date_str = loan['return_date']
                        
                        date_obj = datetime.strptime(date_str, '%Y-%m-%d').date()
                        days_ago = (datetime.now().date() - date_obj).days
                        
                        if days_ago == 0:
                            date_display = "Today"
                        elif days_ago == 1:
                            date_display = "Yesterday"
                        else:
                            date_display = f"{days_ago} days ago"
                        
                        st.markdown(f"""
                        <div class="activity-item">
                            <div style="display: flex; justify-content: space-between;">
                                <div>{activity_icon} {activity_text}</div>
                                <div style="color: #6c757d; font-size: 0.9rem;">{date_display}</div>
                            </div>
                        </div>
                        """, unsafe_allow_html=True)
                    except IndexError as ie:
                        st.error(f"Loan processing error: {ie}")
            except Exception as e:
                st.error(f"Error processing recent loans: {e}")
        else:
            st.info("No recent activities")
        
        st.markdown("</div>", unsafe_allow_html=True)

# Books Management page with improved organization and features
def book_management():
    st.title("📚 Book Management")
    
    tabs = st.tabs(["Books Catalog", "Add New Book", "Edit Book", "Bulk Import"])
    
    with tabs[0]:  # Books Catalog
        st.subheader("Books Catalog")
        
        # Advanced search and filter controls in a card
        st.markdown("<div class='card'>", unsafe_allow_html=True)
        
        col1, col2, col3 = st.columns([2, 1, 1])
        
        with col1:
            search_term = st.text_input("Search books by title, author, or ID", placeholder="Search...")
        
        with col2:
            genre_filter = st.selectbox("Filter by genre", ["All"] + sorted(st.session_state.books['genre'].unique().tolist()))
        
        with col3:
            status_filter = st.selectbox("Filter by status", ["All", "Available", "Checked Out", "Processing", "Lost"])
        
        st.markdown("</div>", unsafe_allow_html=True)
        
        # Filter the books based on search and filter criteria
        filtered_books = st.session_state.books.copy()
        
        if search_term:
            filtered_books = filtered_books[
                filtered_books['title'].str.contains(search_term, case=False) | 
                filtered_books['author'].str.contains(search_term, case=False) |
                filtered_books['id'].str.contains(search_term, case=False)
            ]
        
        if genre_filter != "All":
            filtered_books = filtered_books[filtered_books['genre'] == genre_filter]
        
        if status_filter != "All":
            filtered_books = filtered_books[filtered_books['status'] == status_filter]
        
        # Format the status column with colored indicators
        def format_status(status):
            if status == "Available":
                return f"<span class='status-available'>● {status}</span>"
            elif status == "Checked Out":
                return f"<span class='status-checked-out'>● {status}</span>"
            elif status == "Processing":
                return f"<span class='status-processing'>● {status}</span>"
            else:
                return f"<span>● {status}</span>"
        
        display_df = filtered_books.copy()
        display_df['status'] = display_df['status'].apply(format_status)
        
        # Add action buttons for each book
        display_df['actions'] = ['View/Edit']*len(display_df)
        
        # Show the results in a styled container
        st.markdown("<div class='dataframe-container'>", unsafe_allow_html=True)
        st.write(display_df.to_html(escape=False, index=False), unsafe_allow_html=True)
        st.markdown("</div>", unsafe_allow_html=True)
        
        col1, col2 = st.columns([1, 1])
        
        with col1:
            if st.button("Export to CSV", key="export_books"):
                csv = filtered_books.to_csv(index=False)
                b64 = base64.b64encode(csv.encode()).decode()
                href = f'<a href="data:file/csv;base64,{b64}" download="books_catalog.csv">Download CSV File</a>'
                st.markdown(href, unsafe_allow_html=True)
        
        with col2:
            if st.button("Print Barcode Labels", key="print_labels"):
                st.info("Barcode label printing functionality would be implemented here.")
    
    with tabs[1]:  # Add New Book
        st.subheader("Add New Book")
        
        st.markdown("<div class='card'>", unsafe_allow_html=True)
        
        with st.form("add_book_form"):
            new_book_id = f"B{str(len(st.session_state.books) + 1).zfill(3)}"
            st.text_input("Book ID", new_book_id, disabled=True)
            
            col1, col2 = st.columns(2)
            
            with col1:
                new_title = st.text_input("Title", key="new_title")
                new_author = st.text_input("Author", key="new_author")
                new_genre = st.selectbox("Genre", [
                    "Fiction", "Non-Fiction", "Fantasy", "Sci-Fi", "Mystery", 
                    "Biography", "History", "Self-Help", "Children", "Manga",
                    "Poetry", "Reference", "Science", "Travel", "Other"
                ])
            
            with col2:
                new_year = st.number_input("Published Year", min_value=1000, max_value=datetime.now().year, 
                                          value=datetime.now().year)
                new_status = st.selectbox("Status", ["Available", "Checked Out", "Processing", "Lost"])
                new_copies = st.number_input("Number of Copies", min_value=1, value=1)
            
            st.text_area("Description (Optional)", key="new_description")
            
            col1, col2 = st.columns(2)
            with col1:
                st.file_uploader("Upload Cover Image (Optional)", type=['jpg', 'jpeg', 'png'], key="new_cover")
            with col2:
                st.text_input("ISBN (Optional)", key="new_isbn")
            
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
        
        st.markdown("</div>", unsafe_allow_html=True)
    
    with tabs[2]:  # Edit Book
        st.subheader("Edit Book")
        
        book_to_edit = st.selectbox("Select a book to edit", 
                                  st.session_state.books['title'].tolist(), 
                                  key="book_to_edit")
        
        if book_to_edit:
            st.markdown("<div class='card'>", unsafe_allow_html=True)
            
            book_index = st.session_state.books[st.session_state.books['title'] == book_to_edit].index[0]
            book_data = st.session_state.books.iloc[book_index]
            
            with st.form("edit_book_form"):
                st.text_input("Book ID", book_data['id'], disabled=True, key="edit_id")
                
                col1, col2 = st.columns(2)
                
                with col1:
                    edit_title = st.text_input("Title", book_data['title'], key="edit_title")
                    edit_author = st.text_input("Author", book_data['author'], key="edit_author")
                    genres = ["Fiction", "Non-Fiction", "Fantasy", "Sci-Fi", "Mystery", 
                            "Biography", "History", "Self-Help", "Children", "Manga",
                            "Poetry", "Reference", "Science", "Travel", "Other"]
                    genre_index = genres.index(book_data['genre']) if book_data['genre'] in genres else 0
                    edit_genre = st.selectbox("Genre", genres, index=genre_index)
                
                with col2:
                    edit_year = st.number_input("Published Year", min_value=1000, max_value=datetime.now().year, 
                                              value=book_data['published_year'])
                    statuses = ["Available", "Checked Out", "Processing", "Lost"]
                    status_index = statuses.index(book_data['status']) if book_data['status'] in statuses else 0
                    edit_status = st.selectbox("Status", statuses, index=status_index)
                
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
            
            st.markdown("</div>", unsafe_allow_html=True)
            
            # Show active loans for this book
            book_id = book_data['id']
            active_loans = st.session_state.loans[
                (st.session_state.loans['book_id'] == book_id) & 
                (st.session_state.loans['status'] == 'Active')
            ]
            
            if not active_loans.empty:
                st.markdown("<div class='card'>", unsafe_allow_html=True)
                st.subheader("Current Loans")
                
                loan_details = []
                for _, loan in active_loans.iterrows():
                    patron_info = st.session_state.patrons[st.session_state.patrons['id'] == loan['patron_id']].iloc[0]
                    loan_details.append({
                        'Patron': patron_info['name'],
                        'Checkout Date': loan['checkout_date'],
                        'Due Date': loan['due_date'],
                        'Status': 'Overdue' if datetime.now().date() > datetime.strptime(loan['due_date'], '%Y-%m-%d').date() else 'On Time'
                    })
                
                loan_df = pd.DataFrame(loan_details)
                st.dataframe(loan_df, use_container_width=True)
                st.markdown("</div>", unsafe_allow_html=True)
    
    with tabs[3]:  # Bulk Import
        st.subheader("Bulk Import Books")
        
        st.markdown("<div class='card'>", unsafe_allow_html=True)
        st.write("Use this feature to import multiple books at once from a CSV file.")
        
        st.write("The CSV should have the following columns:")
        st.code("title,author,genre,published_year,status")
        
        upload_file = st.file_uploader("Choose a CSV file", type="csv")
        
        if upload_file:
            try:
                new_books = pd.read_csv(upload_file)
                # Validate columns, process data
            except Exception as e:
                st.error(f"Error reading CSV file: {e}")

# Call the sidebar navigation
selected_page = sidebar_navigation()

# Render the corresponding page based on the selected option
if selected_page == "Dashboard":
    dashboard()
elif selected_page == "Books":
    book_management()
# Add additional pages like "Patrons", etc., if defined
