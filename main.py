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

PANTONE_COLORS = {
    'primary': '#0F4C81',     # Pantone Classic Blue
    'secondary': '#4A3041',   # Pantone Deep Purple
    'accent': '#B63F32',      # Pantone Cayenne
    'background': '#1F2A44',  # Pantone Navy Peony
    'light_bg': '#2A3B55',    # Lighter shade of Navy Peony
    'text': '#F5F5F5',        # Off-white for text
    'success': '#2A5C3F',     # Pantone Forest Biome
    'warning': '#B5651D',     # Pantone Glazed Ginger
    'danger': '#9E2B25',      # Pantone Red Pear
    'info': '#367588',        # Pantone Biscay Bay
    'highlight': '#DB4F54'    # Pantone Fiery Red (for highlighting)
}

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
st.markdown(f"""
<style>
    /* Main background and fonts */
    .main {{
        background-color: {PANTONE_COLORS['background']};
        color: {PANTONE_COLORS['text']};
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }}
    
    /* Headers */
    h1, h2, h3, h4 {{
        color: {PANTONE_COLORS['text']};
        font-weight: 600;
    }}
    
    h1 {{
        font-size: 2.5rem;
        border-bottom: 2px solid {PANTONE_COLORS['primary']};
        padding-bottom: 0.5rem;
        margin-bottom: 1.5rem;
    }}
    
    h2 {{
        font-size: 1.8rem;
        margin-top: 1.5rem;
    }}
    
    /* Cards and containers */
    .card {{
        background-color: {PANTONE_COLORS['light_bg']};
        border-radius: 10px;
        box-shadow: 0 4px 8px rgba(0,0,0,0.3);
        padding: 20px;
        margin-bottom: 20px;
        transition: transform 0.2s ease, box-shadow 0.2s ease;
        color: {PANTONE_COLORS['text']};
    }}
    
    .card:hover {{
        transform: translateY(-5px);
        box-shadow: 0 8px 16px rgba(0,0,0,0.3);
    }}
    
    .metric-card {{
        text-align: center;
        padding: 15px;
    }}
    
    .metric-value {{
        font-size: 2.5rem;
        font-weight: 700;
        color: {PANTONE_COLORS['text']};
        margin: 10px 0;
    }}
    
    .metric-label {{
        font-size: 1rem;
        color: {PANTONE_COLORS['text']};
        opacity: 0.8;
    }}
    
    /* Buttons and inputs */
    .stButton > button {{
        background-color: {PANTONE_COLORS['primary']};
        color: white;
        border-radius: 5px;
        padding: 0.5rem 1rem;
        border: none;
        transition: background-color 0.3s ease;
        font-weight: 500;
    }}
    
    .stButton > button:hover {{
        background-color: {PANTONE_COLORS['secondary']};
    }}
    
    .secondary-button > button {{
        background-color: {PANTONE_COLORS['secondary']};
    }}
    
    .secondary-button > button:hover {{
        background-color: {PANTONE_COLORS['accent']};
    }}
    
    .stTextInput > div > div > input, 
    .stSelectbox > div > div > div {{
        border-radius: 5px;
        background-color: rgba(255, 255, 255, 0.1);
        color: {PANTONE_COLORS['text']};
        border-color: {PANTONE_COLORS['secondary']};
    }}
    
    /* Tables */
    .dataframe-container {{
        border-radius: 10px;
        overflow: hidden;
        box-shadow: 0 4px 8px rgba(0,0,0,0.3);
        background-color: {PANTONE_COLORS['light_bg']};
    }}
    
    .dataframe {{
        color: {PANTONE_COLORS['text']};
    }}
    
    .dataframe th {{
        background-color: {PANTONE_COLORS['secondary']};
        color: {PANTONE_COLORS['text']};
    }}
    
    .dataframe td {{
        background-color: {PANTONE_COLORS['light_bg']};
    }}
    
    /* Custom elements */
    .activity-item {{
        padding: 10px 15px;
        border-left: 3px solid {PANTONE_COLORS['primary']};
        background-color: rgba(255, 255, 255, 0.05);
        margin-bottom: 10px;
        border-radius: 0 5px 5px 0;
    }}
    
    /* Status indicators */
    .status-available {{
        color: {PANTONE_COLORS['success']};
        font-weight: 500;
    }}
    
    .status-checked-out {{
        color: {PANTONE_COLORS['danger']};
        font-weight: 500;
    }}
    
    .status-processing {{
        color: {PANTONE_COLORS['warning']};
        font-weight: 500;
    }}
    
    .status-overdue {{
        color: {PANTONE_COLORS['highlight']};
        font-weight: 700;
    }}
    
    /* Sidebar */
    .css-1d391kg, .css-1wrcr25 {{
        background-color: {PANTONE_COLORS['background']};
    }}
    
    .css-12oz5g7, .css-1aumxhk {{
        max-width: 100%;
        padding: 2rem 1rem;
    }}
    
    /* Tabs */
    .stTabs [data-baseweb="tab-list"] {{
        gap: 2px;
    }}
    
    .stTabs [data-baseweb="tab"] {{
        background-color: {PANTONE_COLORS['light_bg']};
        color: {PANTONE_COLORS['text']};
        border-radius: 5px 5px 0 0;
    }}
    
    .stTabs [aria-selected="true"] {{
        background-color: {PANTONE_COLORS['primary']};
    }}
    
    /* Multiselect */
    .stMultiSelect div[data-baseweb="select"] span {{
        color: {PANTONE_COLORS['text']};
    }}
    
    /* Hide the Streamlit footer and menu */
    #MainMenu {{visibility: hidden;}}
    footer {{visibility: hidden;}}
</style>
""", unsafe_allow_html=True)

# Sidebar navigation with improved styling and organization
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
                "container": {"padding": "0!important", "background-color": PANTONE_COLORS['background']},
                "icon": {"color": PANTONE_COLORS['primary'], "font-size": "20px"}, 
                "nav-link": {"font-size": "16px", "text-align": "left", "margin":"0px", 
                            "--hover-color": PANTONE_COLORS['light_bg']},
                "nav-link-selected": {"background-color": PANTONE_COLORS['primary']},
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
def create_card(title, value, icon, color=PANTONE_COLORS['primary']):
    html = f"""
    <div class="card metric-card">
        <div style="font-size: 2rem; color: {color};">{icon}</div>
        <div class="metric-value" style="color: {color};">{value}</div>
        <div class="metric-label">{title}</div>
    </div>
    """
    return html

# Dashboard page with improved visualization and layout
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
            PANTONE_COLORS['primary']
        ), unsafe_allow_html=True)
        
    with col2:
        st.markdown(create_card(
            "Total Patrons", 
            len(st.session_state.patrons), 
            "👥", 
            PANTONE_COLORS['success']
        ), unsafe_allow_html=True)
        
    with col3:
        active_loans = len(st.session_state.loans[st.session_state.loans['status'] == 'Active'])
        st.markdown(create_card(
            "Active Loans", 
            active_loans, 
            "📖", 
            PANTONE_COLORS['warning']
        ), unsafe_allow_html=True)
        
    with col4:
        # Calculate overdue loans
        today = datetime.now().date()
        upcoming_events = st.session_state.events[
            pd.to_datetime(st.session_state.events['date']).dt.date >= today
        ].sort_values('date').head(3)
        
        # Calculate overdue books
        today = datetime.now().date()
        overdue_count = len(st.session_state.loans[
            (pd.to_datetime(st.session_state.loans['due_date']).dt.date < today) & 
            (st.session_state.loans['return_date'].isnull())
        ])
        
        st.markdown(create_card(
            "Overdue Books", 
            overdue_count, 
            "⏰", 
            PANTONE_COLORS['danger']
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
            'Available': PANTONE_COLORS['success'],
            'Checked Out': PANTONE_COLORS['danger'],
            'Processing': PANTONE_COLORS['warning'],
            'Lost': PANTONE_COLORS['secondary']
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
            plot_bgcolor=PANTONE_COLORS['light_bg'],
            paper_bgcolor=PANTONE_COLORS['light_bg'],
            font=dict(color=PANTONE_COLORS['text']),
            xaxis=dict(showgrid=False),
            yaxis=dict(showgrid=False),
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
        
        # Create a custom color sequence using Pantone colors
        genre_colors = [
            PANTONE_COLORS['primary'], 
            PANTONE_COLORS['secondary'],
            PANTONE_COLORS['accent'],
            PANTONE_COLORS['info'],
            PANTONE_COLORS['warning']
        ]
        
        fig = px.pie(
            genre_counts, 
            names='Genre', 
            values='Count',
            hole=0.3,
            color_discrete_sequence=genre_colors
        )
        
        fig.update_layout(
            height=300,
            margin=dict(l=20, r=20, t=30, b=20),
            paper_bgcolor=PANTONE_COLORS['light_bg'],
            plot_bgcolor=PANTONE_COLORS['light_bg'],
            font=dict(color=PANTONE_COLORS['text'])
        )
        
        st.plotly_chart(fig, use_container_width=True)
        st.markdown("</div>", unsafe_allow_html=True)
        
    with col2:
        # Upcoming events card
        st.markdown("<div class='card'>", unsafe_allow_html=True)
        st.subheader("Upcoming Events")
        
        today = datetime.now().date()
        upcoming_events = st.session_state.events[
            pd.to_datetime(st.session_state.events['date']).dt.date >= today
        ].sort_values('date').head(3)
        
        if not upcoming_events.empty:
            for _, event in upcoming_events.iterrows():
                event_date = datetime.strptime(event['date'], '%Y-%m-%d').date()
                days_until = (event_date - today).days
                
                st.markdown(f"""
                <div style="margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px solid {PANTONE_COLORS['secondary']};">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <div>
                            <h4 style="margin-bottom: 5px; color: {PANTONE_COLORS['text']};">{event['title']}</h4>
                            <p style="margin-bottom: 5px; color: {PANTONE_COLORS['text']};">
                                📍 {event['location']} | ⏰ {event['time']}
                            </p>
                        </div>
                        <div style="background-color: {PANTONE_COLORS['secondary']}; padding: 8px; border-radius: 5px; text-align: center;">
                            <span style="font-weight: bold; display: block; font-size: 18px; color: {PANTONE_COLORS['text']};">{days_until}</span>
                            <span style="font-size: 12px; color: {PANTONE_COLORS['text']};">days</span>
                        </div>
                    </div>
                    <p style="margin-top: 10px; color: {PANTONE_COLORS['text']};">{event['description'][:100]}...</p>
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
                                <div style="color: {PANTONE_COLORS['text']}; font-size: 0.9rem;">{date_display}</div>
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

# Call the sidebar navigation
selected_page = sidebar_navigation()

# Render the corresponding page based on the selected option
if selected_page == "Dashboard":
    dashboard()
elif selected_page == "Books":
    st.warning("The 'Books' page is under construction.")
# Add additional pages like "Patrons", etc., if defined
def book_management():
    st.title("📚 Book Management")
    st.write("This is the Book Management page. Add functionality here.")

if selected_page == "Books":
    book_management()
