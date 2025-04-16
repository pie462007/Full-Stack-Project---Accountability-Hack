import { useAuthContext } from "../hooks/useAuthContext";

function Friends() {

    const {user} = useAuthContext()

    return (
        <div className="friends-div" style={{ display: "flex", gap: "20px" }}>
            {/* Finding Friends Section */}
            <div className="find-friends" style={{ flex: 1, border: "1px solid #ccc", padding: "10px" }}>
                <h2>Find Friends</h2>
                <input
                    type="text"
                    placeholder="Search for friends by username..."
                    style={{
                        width: "95%",
                        padding: "8px",
                        margin: "-5px 0 10px 0",
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                    }}
                />
                {/* Add search functionality or friend suggestions here */}
            </div>


            {/* Managing Current Friends Section */}
            <div className="manage-friends" style={{ flex: 1, border: "1px solid #ccc", padding: "10px" }}>
                <h2>Manage Friends</h2>
                <p>View and manage your current friends here.</p>
                {/* Add friend list and management options here */}
            </div>
        </div>
    );
}
export default Friends
