using System.Collections.Generic;
using System.Threading.Tasks;
using API.Dtos;
using API.Errors;
using API.Helpers;
using AutoMapper;
using Core.Entities;
using Core.Interfaces;
using Core.Specifications;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
  public class ProductsController : BaseApiController
  {
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public ProductsController(IUnitOfWork unitOfWork, IMapper mapper)
    {
      _mapper = mapper;
      _unitOfWork = unitOfWork;
    }

    [HttpGet]
    public async Task<ActionResult<Pagination<ProductToReturnDto>>> GetProducts(
      [FromQuery] ProductSpecParams productParams)
    {
      var spec = new ProductsWithTypesAndBrandsSpecification(productParams);
      var countSpec = new ProductWithFiltersForCountSpecification(productParams);

      var totalItems = await _unitOfWork.Repository<Product>().CountAsync(countSpec);
      var products = await _unitOfWork.Repository<Product>().ListAsync(spec);
      var data = _mapper.Map<IReadOnlyList<Product>,
        IReadOnlyList<ProductToReturnDto>>(products);

      return Ok(new Pagination<ProductToReturnDto>(productParams.PageIndex,
        productParams.PageSize, totalItems, data));
    }

    [HttpGet("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ProductToReturnDto>> GetProduct(int id)
    {
      var spec = new ProductsWithTypesAndBrandsSpecification(id);
      var product = await _unitOfWork.Repository<Product>().GetEntityWithSpec(spec);
      return product != null ? _mapper.Map<Product, ProductToReturnDto>(product)
        : NotFound(new ApiResponse(404));
    }

    [HttpGet("brands")]
    public async Task<ActionResult<IReadOnlyList<ProductBrand>>> GetProductBrands()
    {
      return Ok(await _unitOfWork.Repository<ProductBrand>().ListAllAsync());
    }

    [HttpGet("types")]
    public async Task<ActionResult<IReadOnlyList<ProductType>>> GetProductTypes()
    {
      return Ok(await _unitOfWork.Repository<ProductType>().ListAllAsync());
    }
  }
}