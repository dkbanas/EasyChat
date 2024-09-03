using API.Models;

namespace API.Interfaces;

public interface IUserConnectionManager
{
    void AddConnection(string connectionId, UserConnection userConnection);
    void RemoveConnection(string connectionId);
    UserConnection? GetConnection(string connectionId);
    IEnumerable<UserConnection> GetConnectionsByRoom(string room);
}