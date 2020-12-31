using System.Threading.Tasks;
using API.Dtos;
using API.Errors;
using API.Extensions;
using AutoMapper;
using Core.Entities.Identity;
using Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
  public class AccountController : BaseApiController
  {
    private readonly SignInManager<AppUser> _signInManager;
    private readonly UserManager<AppUser> _userManager;
    private readonly ITokenService _tokenService;
    private readonly IMapper _mapper;
    public AccountController(UserManager<AppUser> userManager,
      SignInManager<AppUser> signInManager,
      ITokenService tokenService,
      IMapper mapper)
    {
      _tokenService = tokenService;
      _userManager = userManager;
      _signInManager = signInManager;
      _mapper = mapper;
    }

    [Authorize]
    [HttpGet]
    public async Task<ActionResult<UserDto>> GetCurrentUser()
    {
      var user = await _userManager.FindByEmailFromClaimsPrincipal(HttpContext.User);

      return new UserDto
      {
        Email = user.Email,
        Token = _tokenService.CreateToken(user),
        DisplayName = user.DisplayName,
      };
    }

    [HttpGet("emailexists")]
    public async Task<ActionResult<bool>> CheckEmailExistsAsync([FromQuery] string email)
    {
      return await _userManager.FindByEmailAsync(email) != null;
    }

    [Authorize]
    [HttpGet("address")]
    public async Task<ActionResult<AddressDto>> GetUserAddress()
    {
      var user = await _userManager
        .FindByUserByClaimsPrincipleWithAddressAsync(HttpContext.User);
      return _mapper.Map<Address, AddressDto>(user.Address);
    }

    [Authorize]
    [HttpPut("address")]
    public async Task<ActionResult<AddressDto>> UpdateUserAddress(AddressDto addressDto)
    {
      var user = await _userManager.FindByUserByClaimsPrincipleWithAddressAsync(HttpContext.User);
      user.Address = _mapper.Map<AddressDto, Address>(addressDto);
      var result = await _userManager.UpdateAsync(user);
      return result.Succeeded ?
        Ok(_mapper.Map<Address, AddressDto>(user.Address)) :
        BadRequest("Problem updating the user");
    }

    [HttpPost("login")]
    public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
    {
      ActionResult<UserDto> res;
      var user = await _userManager.FindByEmailAsync(loginDto.Email);
      if (user == null)
      {
        res = Unauthorized(new ApiResponse(401)); ;
      }
      else
      {
        var result = await _signInManager.CheckPasswordSignInAsync(user, loginDto.Password, false);
        if (!result.Succeeded)
        {
          res = Unauthorized(new ApiResponse(401));
        }
        else
        {
          res = new UserDto
          {
            Email = user.Email,
            Token = _tokenService.CreateToken(user),
            DisplayName = user.DisplayName,
          };
        }
      }
      return res;
    }

    [HttpPost("register")]
    public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
    {
      ActionResult<UserDto> res;
      if (CheckEmailExistsAsync(registerDto.Email).Result.Value)
      {
        res = BadRequest(new ApiValidationErrorResponse { Errors = new[] { "Email address is in use" } });
      }
      else
      {
        var user = new AppUser
        {
          DisplayName = registerDto.DisplayName,
          Email = registerDto.Email,
          UserName = registerDto.Email
        };

        var result = await _userManager.CreateAsync(user, registerDto.Password);

        res = !result.Succeeded ?
          BadRequest(new ApiResponse(400)) :
          new UserDto
          {
            DisplayName = user.DisplayName,
            Token = _tokenService.CreateToken(user),
            Email = user.Email,
          };
      }
      return res;
    }

  }
}