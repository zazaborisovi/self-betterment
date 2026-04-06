import { useAuth } from "../contexts/authContext"
import { useFriend } from "../contexts/friendContext"


const Friends = () =>{
    const {friends , friendRequests , acceptFriendRequest , rejectFriendRequest , cancelFriendRequest} = useFriend()
    const {user} = useAuth()

    const handleCancel = (requestId) =>{
        cancelFriendRequest(requestId)
    }

    return (
        <div className="flex">
            <div>
                {friends?.map((friend) => (
                    <div key={friend._id}>
                        <h1 className="text-white">{friend.username}</h1>
                    </div>
                ))}
            </div>
            <div>
                {friendRequests?.map((request) => (
                    <div key={request._id}>
                        <h1 className="text-white">
                            {request.from._id == user._id ? (
                                <>
                                    <p>To: {request.to.username}</p>
                                    <button onClick={() => handleCancel(request._id)}>Cancel</button>
                                </>
                            ) : (
                                <>
                                    <p>From: {request.from.username}</p>
                                    <button>Accept</button>
                                    <button>Reject</button>
                                </>
                            )}
                        </h1>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Friends