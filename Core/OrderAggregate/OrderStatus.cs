using System.Runtime.Serialization;

namespace Core.OrderAggregate
{
  public enum OrderStatus
  {
    [EnumMember(Value = "Pending")]
    Pending,
    [EnumMember(Value = "PaymentRecevied")]
    PaymentRecevied,
    [EnumMember(Value = "PaymentFailed")]
    PaymentFailed,
  }
}